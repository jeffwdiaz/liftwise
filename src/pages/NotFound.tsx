
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="flex items-center justify-center">
          <Dumbbell className="h-12 w-12 text-swiss-red" />
        </div>
        
        <h1 className="swiss-title text-6xl">404</h1>
        <p className="text-xl text-muted-foreground">This page seems to be missing from your workout routine</p>
        
        <div className="pt-4">
          <Button className="swiss-button" asChild>
            <a href="/">Return to Workouts</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
