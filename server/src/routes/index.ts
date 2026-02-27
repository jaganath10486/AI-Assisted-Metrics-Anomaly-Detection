import { Router } from "express";
import MetricRoute from "./metrics.route";
import DeploymentRoute from "./deployment.route";
import AnomalyRoute from "./anomaly.route";
import ChatRoute from "./chat.route";

const router = Router();
const metricRoute = new MetricRoute();
const deploymentRoute = new DeploymentRoute();
const anomalyRoute = new AnomalyRoute();
const chatRoute = new ChatRoute();

router.use("/", metricRoute.router);
router.use("/", deploymentRoute.router);
router.use("/", anomalyRoute.router);
router.use("/", chatRoute.router);

export default router;