

export const getMockCodeMap = () => {
const MOCK_CODE_MAPS = [
  {
    name: "auth-service",
    metricOwnership: [
      {
        metricName: "response_time",
        keyFunctions: [
          { name: "verifyToken", file: "src/services/jwt.service.ts" },
          {
            name: "authMiddleware",
            file: "src/middlewares/auth.middleware.ts",
          },
        ],
      },
      {
        metricName: "error_rate",
        keyFunctions: [
          {
            name: "authMiddleware",
            file: "src/middlewares/auth.middleware.ts",
          },
          { name: "handleLoginRequest", file: "src/routes/auth.route.ts" },
        ],
      },
    ],
  },
  {
    name: "notification-service",
    metricOwnership: [
      {
        metricName: "response_time",
        keyFunctions: [
          {
            name: "sendNotification",
            file: "src/services/notification.service.ts",
          },
          { name: "dispatchEmail", file: "src/channels/email.channel.ts" },
          { name: "dispatchPush", file: "src/channels/push.channel.ts" },
        ],
      },
      {
        metricName: "error_rate",
        keyFunctions: [
          {
            name: "sendNotification",
            file: "src/services/notification.service.ts",
          },
          { name: "dispatchEmail", file: "src/channels/email.channel.ts" },
        ],
      },
    ],
  },
];
return MOCK_CODE_MAPS
};

export const getMockDeployment = () => { 
  const now = Date.now();
const MOCK_DEPLOYMENTS = [
  {
    service: "auth-service",
    commitSha: "wed43r34",
    commitMsg: "Refactor JWT verification",
    author: "snjnr104@gmail.com",
    status: "deployed",
    deployedAt: new Date(now - 20 * 60 * 1000), // 20 mins ago
  },
  {
    service: "notification-service",
    commitSha: "48fejf34we",
    commitMsg: "Increase email dispatch concurrency",
    author: "hello123@gmail.com",
    status: "deployed",
    deployedAt: new Date(now - 40 * 60 * 1000), // 40 mins ago
  },
  ];
  return MOCK_DEPLOYMENTS
}


interface MetricPoint {
  service: string;
  metricName: string;
  value: number;
  timestamp: Date;
}

function point(
  service: string,
  metricName: string,
  value: number,
  timestamp: Date,
): MetricPoint {
  return {
    service,
    metricName,
    value: parseFloat(value.toFixed(4)),
    timestamp,
  };
}

export function generateHistoricalMetrics(): MetricPoint[] {
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours
  const INTERVAL_MS = 15 * 1000; // 15 seconds
  const points: MetricPoint[] = [];

  const authSpikeStart = now - 14 * 60 * 1000; // 14 mins ago - 6 mins after deployment
  const notificationSpikeStart = now - 32 * 60 * 1000; // 32 mins ago - 8 mins after deployment

  for (let t = now - TWO_HOURS; t <= now; t += INTERVAL_MS) {
    const ts = new Date(t);

    const authTimeSince =
      t >= authSpikeStart ? (t - authSpikeStart) / INTERVAL_MS : 0;
    const authMult =
      t >= authSpikeStart ? Math.pow(1.4, Math.min(authTimeSince, 15)) : 0;
    console.log("authMult", authMult);
    points.push(
      point(
        "auth-service",
        "response_time",
        t >= authSpikeStart
          ? 200 * authMult + Math.random() * 50
          : 70 + Math.random() * 30,
        ts,
      ),
    );

    points.push(
      point(
        "auth-service",
        "error_rate",
        t >= authSpikeStart
          ? Math.min(0.05 * authMult, 0.95) + Math.random() * 0.05 // Progressive error rate capping at 100%
          : 0.003 + Math.random() * 0.004,
        ts,
      ),
    );

    const notifTimeSince =
      t >= notificationSpikeStart
        ? (t - notificationSpikeStart) / INTERVAL_MS
        : 0;
    const notifMult =
      t >= notificationSpikeStart
        ? Math.pow(1.4, Math.min(notifTimeSince, 15))
        : 0;

    points.push(
      point(
        "notification-service",
        "response_time",
        t >= notificationSpikeStart
          ? 300 * notifMult + Math.random() * 100
          : 180 + Math.random() * 60,
        ts,
      ),
    );

    points.push(
      point(
        "notification-service",
        "error_rate",
        t >= notificationSpikeStart
          ? Math.min(0.04 * notifMult, 0.95) + Math.random() * 0.04
          : 0.002 + Math.random() * 0.002,
        ts,
      ),
    );
  }

  return points;
}
