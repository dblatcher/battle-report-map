import { createTheme } from "@mui/material";
import { brown } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        secondary: { ...brown, light: brown[50] }
    }
})


