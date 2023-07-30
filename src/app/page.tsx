'use client'
import { AppMain } from "@/components/AppMain";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";


export default function Home() {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <AppMain />
      </ThemeProvider>
    </main>
  )
}
