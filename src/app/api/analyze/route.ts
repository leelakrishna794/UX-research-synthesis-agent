import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url = "" } = body;

    // Extract domain or platform name from URL
    let platform = "the platform";
    if (url) {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        platform = urlObj.hostname.replace('www.', '');
      } catch (e) {
        platform = url;
      }
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return the JSON format dynamically adjusted based on input URL
    return NextResponse.json({
      "themes": [
        "User Guidance and Tutorials",
        "Navigation and Information Architecture",
        "Checkout and Conversion Optimization",
        "User Retention and Engagement",
        "Customer Support Efficiency"
      ],
      "pain_points": [
        "High dropout rate during signup",
        "Users feel lost and overwhelmed",
        "High frustration levels",
        "Decreased engagement due to ineffective exploration",
        "Abandoned carts",
        "Low conversion rates",
        "High churn rate",
        "Users feel neglected",
        "Negative sentiment towards the brand",
        "Increased support workload"
      ],
      "journey_mapping": {
        "Onboarding": [
          {
            "issue": "Confusing registration process",
            "description": `Users struggle to understand the required fields and steps to complete the registration on ${platform}.`,
            "pain_point": "High dropout rate during signup"
          },
          {
            "issue": "Lack of onboarding tutorials or guides",
            "description": "First-time users do not receive adequate guidance on how to navigate the platform.",
            "pain_point": "Users feel lost and overwhelmed"
          }
        ],
        "Exploration": [
          {
            "issue": "Difficult navigation",
            "description": `Users find it hard to locate key features and information on ${platform} due to poor menu structure.`,
            "pain_point": "High frustration levels"
          },
          {
            "issue": "Inadequate search functionality",
            "description": "Search results are not relevant or comprehensive, making it hard for users to find what they need.",
            "pain_point": "Decreased engagement due to ineffective exploration"
          }
        ],
        "Conversion": [
          {
            "issue": "Complex checkout process",
            "description": "The steps required to complete a purchase are too many and not user-friendly.",
            "pain_point": "Abandoned carts"
          },
          {
            "issue": "Lack of trust signals",
            "description": "Users are hesitant to make purchases due to insufficient security and trust indicators.",
            "pain_point": "Low conversion rates"
          }
        ],
        "Retention": [
          {
            "issue": "Limited features for returning users",
            "description": "Returning users find little new content or features to keep them engaged.",
            "pain_point": "High churn rate"
          },
          {
            "issue": "Poor communication of updates",
            "description": "Users are not informed about new features or updates effectively.",
            "pain_point": "Users feel neglected"
          }
        ],
        "Support": [
          {
            "issue": "Slow response time from support",
            "description": "Users experience long wait times for assistance, leading to frustration.",
            "pain_point": "Negative sentiment towards the brand"
          },
          {
            "issue": "Inadequate self-service options",
            "description": "Users have difficulty finding answers to common questions without contacting support.",
            "pain_point": "Increased support workload"
          }
        ]
      },
      "insights": [
        `Streamlining the registration process for ${platform} can significantly reduce drop-offs.`,
        "Improving search functionality may enhance user engagement.",
        "Simplifying the checkout process could lead to higher sales.",
        "Regular updates and features for returning users can increase loyalty.",
        "Enhancing self-service options could reduce support workload and improve user satisfaction."
      ],
      "recommendations": [
        {
          "suggestion": `Redesign the ${platform} registration form to be more intuitive with fewer fields and clear instructions.`,
          "priority": 1,
          "implementation_notes": "Utilize progressive disclosure to reduce cognitive load and guide users step-by-step through the registration."
        },
        {
          "suggestion": "Introduce onboarding tutorials or guided tours for first-time users.",
          "priority": 2,
          "implementation_notes": "Create interactive walkthroughs that highlight key features and how to use them effectively."
        },
        {
          "suggestion": "Revamp the site navigation structure to ensure key features are easily accessible.",
          "priority": 1,
          "implementation_notes": "Conduct card sorting sessions to understand user expectations and create a more intuitive menu."
        },
        {
          "suggestion": `Enhance the search functionality on ${platform} to include filters and predictive text.`,
          "priority": 2,
          "implementation_notes": "Implement algorithms that prioritize relevant results based on user behavior and preferences."
        },
        {
          "suggestion": "Simplify the checkout process by reducing the number of steps and incorporating auto-fill functions.",
          "priority": 1,
          "implementation_notes": "Use A/B testing to find the most user-friendly checkout flow and implement security badges for trust."
        },
        {
          "suggestion": "Add visible security indicators during the checkout to build trust.",
          "priority": 2,
          "implementation_notes": "Include SSL certificates, payment method logos, and customer reviews to enhance credibility."
        },
        {
          "suggestion": "Regularly update returning users with new features and content.",
          "priority": 1,
          "implementation_notes": "Utilize email newsletters and in-app notifications to keep users engaged and informed."
        },
        {
          "suggestion": "Improve communication of updates through a dedicated dashboard or notifications.",
          "priority": 2,
          "implementation_notes": "Create a user-friendly interface that showcases updates and new features prominently."
        },
        {
          "suggestion": "Implement a ticketing system for support to manage inquiries more effectively.",
          "priority": 1,
          "implementation_notes": "Introduce chatbots for common queries and ensure timely follow-ups for unresolved issues."
        },
        {
          "suggestion": "Enhance self-service options through a comprehensive FAQ and community forums.",
          "priority": 2,
          "implementation_notes": "Develop a knowledge base with articles, videos, and user-generated content to empower users to find solutions independently."
        }
      ],
      "success_metrics": {
        "Onboarding": {
          "KPI": "Registration completion rate",
          "goal": "Increase by 25% within 3 months"
        },
        "Exploration": {
          "KPI": "Search engagement rate",
          "goal": "Increase relevant search results by 40% within 4 months"
        },
        "Conversion": {
          "KPI": "Cart abandonment rate",
          "goal": "Reduce by 30% within 6 months"
        },
        "Retention": {
          "KPI": "User churn rate",
          "goal": "Decrease by 20% within 6 months"
        },
        "Support": {
          "KPI": "Average response time to support tickets",
          "goal": "Reduce to under 2 hours within 3 months"
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
