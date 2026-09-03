import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { CurrentEventProvider } from "./data/currentEvent";

export default function App() {
  return (
    <CurrentEventProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CurrentEventProvider>
  );
}
