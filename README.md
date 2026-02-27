# AI-Assisted Metrics Anomaly Detection

This project provides an intelligent, AI-assisted platform to detect and investigate anomalies in infrastructure and application metrics.


## Web Application
[Live Web Application URL](#)


## Screenshots & Demo Video

**Screenshot 1:** `[Placeholder for Dashboard Overview]`  
**Screenshot 2:** `[Placeholder for Anomaly Investigation View]`  


## Architecture Overview

The application includes frontend client, backend service, and AI intelligence processing layer.

- **Frontend (Client)**: Built with Next.js, React, Tailwind CSS, and Lucide Icons. Provides a responsive and interactive dashboard where developers can view anomalies.
- **Backend (Server)**: A Node.js and Express backend built with TypeScript. It ingeps mock metrics, deployment data, and codebase mapping (CodeMap).
- **Data Layer (MongoDB)**: Stores real-time metrics, anomaly events, deployments, and codebase structure (CodeMaps).
- **Intelligence Layer (Google Gemini)**: Receives the context of any detected anomaly (z-score, baseline, metric name, and related source functions) and generates a human-readable explanation and suggested remediation based on the specific lines of code.

##  Anomaly Detection Approach

Metrics (such as Error Rate, Response Time) are continuously monitored via sliding windows.

1. **Rolling Baseline Calculation**: The backend determines a rolling average and standard deviation (variance) for metrics.
2. **Z-Score Spike Detection**: Incoming metrics are evaluated against the current baseline. If a metric breaches a Z-score threshold (e.g., `z > 3`) over a sustained number of data points (e.g : 5), it triggers an anomaly.
3. **Score Calculation**: Anomalies are given a confidence score determined by the magnitude of the spike and its temporal proximity to recent code deployments.
4. **Severity Assignment**: Based on the absolute Z-Score deviation (`>6 = Critical`, `>4 = High`, `>3 = Medium`), the anomaly is assigned with a severity level.

---

##  How Metrics are Linked to Code

The core of the anomaly detection engine relies on **CodeMaps**.
1. **Service Registration**: Services map their key functions to specific metrics. (e.g., `response_time` might be linked to `verifyToken` in `src/services/jwt.service.ts`).
2. **Deployment Correlation**: When an anomaly is detected, the system looks backwards to find the most recent deployment belonging to the compromised service.
3. **Context Construction**: The anomaly document binds the anomalous metric values with the time since the last deploy, and links them to the exact `keyFunctions` associated with that metric.

---

##  How the AI Reasoning Works

Once an anomaly is detected and contextualized with code metadata:
1. **Prompt Construction**: The server constructs a prompt comprising the metric context (value, baseline deviation), the deployment commit message, and the functions potentially causing the issue.
2. **LLM Querying (Gemini)**: The AI engine queries the Gemini model with the prompt.
3. **Resolution generation**: The AI returns a structured JSON payload containing a deep-dive explanation and step-by-step recommendations to resolve the issue.


## Sample Scenario

### Example Metrics
- **Service**: `auth-service`
- **Metric**: `response_time`
- **Rolling Baseline**: `72ms`
- **Anomalous Value**: `268ms` (Z-Score: +4.8)
- **Deployment**: `Refactor JWT verification` (20 mins ago)

###  Detected Anomaly
A sustained spike in `response_time` for the `auth-service`. The anomaly engine flags this as a **High Severity** event due to the significant deviation from the historic norm.

### AI Explanation


### Suggested Fix
