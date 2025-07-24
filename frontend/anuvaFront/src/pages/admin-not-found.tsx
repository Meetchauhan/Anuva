import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/admin-header";

export default function NotFound() {
  return (
    <div className="p-4 md:p-6">
      <Header title="Page Not Found" />
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-status-red" />
              <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-neutral-400 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link href="/">
              <Button className="w-full">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
