"use client"
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Dashboard =  () => {
  const { user,isSignedIn,isLoaded } = useUser();

  if(!isLoaded){
    <h2>Loading</h2>
  }
  else if (!isSignedIn) {
    redirect("/sign-in"); 
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
};

export default Dashboard;
