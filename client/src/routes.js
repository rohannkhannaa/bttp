import agencyProfile from "./views/agencyProfile";
import Dashboard from "./views/Dashboard";
import viewImage from "./views/viewImage";
import OwnedRfps from "./views/OwnedRfps";
import MakePayment from "./views/MakePayment";
import updateAgency from "./views/updateAgency";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    //rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/agencyProfile",
    name: "Agencys Profile",
    //rtlName: "الرموز",
    icon: "tim-icons icon-single-02",
    component: agencyProfile,
    layout: "/admin",
  },
  {
    path: "/viewImage",
    name: "Rfp Gallery",
    //rtlName: "الرموز",
    icon: "tim-icons icon-image-02",
    component: viewImage,
    layout: "/admin",
  },
  {
    path: "/OwnedRfps",
    name: "Owned Rfps",
    //rtlName: "الرموز",
    icon: "tim-icons icon-bank",
    component: OwnedRfps,
    layout: "/admin",
  }, 
  {
    path: "/MakePayment",
    name: "Make Payment",
    //rtlName: "الرموز",
    icon: "tim-icons icon-money-coins",
    component: MakePayment,
    layout: "/admin",
  },
  
  {
    path: "/updateAgency",
    name: "",
    //rtlName: "الرموز",
    icon: "tim-icons",
    component: updateAgency,
    layout: "/admin",
  },
];
export default routes;
