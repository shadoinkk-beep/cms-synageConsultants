"use client";

import { AllowOnlyAuth } from "../components/AllowOnlyAuth";
import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";
import DashboardLayout from "../app/dashboard/layout";



function Page(){

  return <>
  <DashboardLayout>
  <AnalyticsDashboard/>
  </DashboardLayout>
  </>
}


export default Page;