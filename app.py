import os
import time
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from duckduckgo_search import DDGS

# Try importing CrewAI components. Make sure to run: pip install crewai langchain-openai fastapi uvicorn
try:
    from crewai import Agent, Task, Crew, Process, LLM
    from langchain_openai import ChatOpenAI
except ImportError:
    pass # Managed below if missing

app = FastAPI()

# Enable CORS so Next.js frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistence configuration
HISTORY_FILE = "history.json"
REPORTS_FILE = "reports.json"

def load_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                return json.load(f)
            except:
                return []
    return []

def save_data(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

class AnalyzeRequest(BaseModel):
    url: str

class SaveReportRequest(BaseModel):
    id: str = None
    url: str
    data: dict

# IMPORTANT: Set your OpenAI API key in your environment variables
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

# Define the expected JSON format for the AI to output natively
JSON_SCHEMA_PROMPT = """
You MUST output your final answer as raw, valid JSON exactly matching this structure, with no markdown wrappers or backticks:
{
  "themes": ["theme 1", "theme 2"],
  "pain_points": ["pain point 1", "pain point 2"],
  "journey_mapping": {
    "Onboarding": [ {"issue": "...", "description": "...", "pain_point": "..."} ],
    "Exploration": [ {"issue": "...", "description": "...", "pain_point": "..."} ],
    "Conversion": [], "Retention": [], "Support": []
  },
  "insights": ["insight 1", "insight 2"],
  "recommendations": [
    {"suggestion": "...", "priority": 1, "implementation_notes": "..."}
  ],
  "success_metrics": {
    "Onboarding": {"KPI": "...", "goal": "..."}
  }
}
"""

@app.post("/api/analyze")
async def analyze_url(req: AnalyzeRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        # Use an LLM for the Agent
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured on server")
        if api_key.startswith("sk-or"):
            # Use the new CrewAI LLM wrapper for OpenRouter compatibility in v1.x
            llm = LLM(
                model="openrouter/auto",
                api_key=api_key,
                base_url="https://openrouter.ai/api/v1",
                temperature=0.4
            )
        else:
            llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0.4)

        # 1. Define the Agent
        ux_researcher = Agent(
            role='Senior UX Research Synthesizer',
            goal=f'Analyze the UX of the target URL ({req.url}) and extract structured UX themes, pain points, and mapped journey issues.',
            backstory='You are a world-class UX researcher adept at auditing websites and mapping user journeys. You are meticulous, data-driven, and focus on conversions, accessibility, and retention.',
            verbose=True,
            allow_delegation=False,
            llm=llm
        )

        # 2. Autonomous Web Search for Reviews
        domain = req.url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
        feedback_instruction = ""
        try:
            ddg_results = DDGS().text(f"{domain} user reviews complaints reddit UI UX problems", max_results=4)
            if ddg_results:
                feedback_text = "\n".join([r['body'] for r in ddg_results])
                feedback_instruction = f"\n\nCRITICAL CONTEXT: I have actively searched the web for {domain} and gathered these real user complaints and feedback:\n\"\"\"{feedback_text}\"\"\"\n\nYou MUST heavily cross-reference your heuristic findings with these real user complaints. Ensure your Pain Points and Journey Mapping strictly address these exact problems mentioned by users.\n"
        except Exception as e:
            print(f"DDGS Web Search Failed: {e}")

        # 3. Define the Task
        analysis_task = Task(
            description=f'Conduct a heuristic UX audit on {req.url}.{feedback_instruction} Synthesize your findings into deep UX themes, precise pain points, broken down by journey lifecycle (Onboarding, Exploration, Conversion, Retention, Support). Then provide prioritized actionable recommendations and success metrics tracking goals.\n\n{JSON_SCHEMA_PROMPT}',
            expected_output='A raw, valid JSON payload strictly following the provided schema, with no ```json backticks.',
            agent=ux_researcher
        )

        # 3. Define the Crew
        crew = Crew(
            agents=[ux_researcher],
            tasks=[analysis_task],
            verbose=True,
            process=Process.sequential 
        )

        # Kickoff the agent process
        result = crew.kickoff()
        
        # Parse the output string into real JSON
        raw_output = getattr(result, "raw", str(result))
        clean_result = raw_output.replace('```json', '').replace('```', '').strip()
        parsed_json = json.loads(clean_result)

        # Save to history
        history = load_data(HISTORY_FILE)
        history_item = {
            "id": str(uuid.uuid4()),
            "url": req.url,
            "timestamp": time.time(),
            "date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": parsed_json
        }
        history.insert(0, history_item)
        save_data(HISTORY_FILE, history)

        return parsed_json

    except Exception as e:
        print(f"Agent Error: {e}")
        return {
            "themes": ["Agent Initialization Failed"],
            "pain_points": [str(e)],
            "journey_mapping": { "Onboarding": [{"issue": "Error", "description": "Please check your OPENAI_API_KEY", "pain_point": "System Error"}] },
            "insights": ["The CrewAI Python script failed to execute."],
            "recommendations": [{"suggestion": "Add OPENAI_API_KEY to app.py", "priority": 1}],
            "success_metrics": {}
        }

@app.get("/api/history")
async def get_history():
    return load_data(HISTORY_FILE)

@app.delete("/api/history/{item_id}")
async def delete_history(item_id: str):
    history = load_data(HISTORY_FILE)
    new_history = [item for item in history if item["id"] != item_id]
    save_data(HISTORY_FILE, new_history)
    return {"status": "success"}

@app.get("/api/reports")
async def get_reports():
    return load_data(REPORTS_FILE)

@app.post("/api/reports")
async def save_report(req: SaveReportRequest):
    reports = load_data(REPORTS_FILE)
    report_item = {
        "id": req.id or str(uuid.uuid4()),
        "url": req.url,
        "timestamp": time.time(),
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "data": req.data
    }
    reports.insert(0, report_item)
    save_data(REPORTS_FILE, reports)
    return report_item

@app.get("/api/report/{item_id}")
async def get_report_by_id(item_id: str):
    # Check reports first
    reports = load_data(REPORTS_FILE)
    for report in reports:
        if report["id"] == item_id:
            return report
            
    # Then check history
    history = load_data(HISTORY_FILE)
    for item in history:
        if item["id"] == item_id:
            return item
            
    raise HTTPException(status_code=404, detail="Report not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
