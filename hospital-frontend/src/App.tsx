import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
