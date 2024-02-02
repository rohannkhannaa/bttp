import ShqDashboard from "./views/ShqDashboard";
import AddRfp from "./views/AddRfp";
import ApproveRequest from "./views/ApproveRequest";
import shqProfile from "./views/shqProfile";
import viewImage from "./views/viewImage";
import updateShq from "./views/updateShq";
import MakePayment from "./views/MakePayment";

var routes = [
  {
    path: "/ShqDashboard",
    name: "Dashboard",
    //rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: ShqDashboard,
    layout: "/Shq",
  },
  {
    path: "/AddRfp",
    name: "Add Rfp",
    //rtlName: "الرموز",
    icon: "tim-icons icon-world",
    component: AddRfp,
    layout: "/Shq",
  },
  {
    path: "/shqProfile",
    name: "Shq Profile",
    //rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    component: shqProfile,
    layout: "/Shq",
  },
  {
    path: "/ApproveRequest",
    name: "Rfp Requests",
    //rtlName: "الرموز",
    icon: "tim-icons icon-badge",
    component: ApproveRequest,
    layout: "/Shq",
  },
  {
    path: "/viewImage",
    name: "Rfp Gallery",
    //rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    component: viewImage,
    layout: "/Shq",
  },
  {
    path: "/updateShq",
    name: "",
    //rtlName: "الرموز",
    icon: "tim-icons",
    component: updateShq,
    layout: "/Shq",
  },
  {
    path: "/MakePayment",
    name: "Make Payment",
    //rtlName: "الرموز",
    icon: "tim-icons icon-money-coins",
    component: MakePayment,
    layout: "/Shq",
  },
];
export default routes;
