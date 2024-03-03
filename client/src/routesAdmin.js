import AdminDashboard from "./views/AdminDashboard";
import ApproveTransaction from "./views/ApproveTransaction";
import AgencyInfo from "./views/AgencyInfo";
import ShqInfo from "./views/ShqInfo";
import TransactionInfo from "./views/TransactionInfo";

var routes = [ 
  {
    path: "/AdminDashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: AdminDashboard,
    layout: "/Adminn",
  },
  {
    path: "/AgencyInfo",
    name: "AgencyInfo",
    icon: "tim-icons icon-single-02",
    component: AgencyInfo,
    layout: "/Adminn",
  },
  {
    path: "/ShqInfo",
    name: "ShqInfo",
    icon: "tim-icons icon-single-02",
    component: ShqInfo,
    layout: "/Adminn",
  },
  {
    path: "/TransactionInfo",
    name: "TransactionInfo",
    icon: "tim-icons icon-send",
    component: TransactionInfo,
    layout: "/Adminn",
  },
];
export default routes;
