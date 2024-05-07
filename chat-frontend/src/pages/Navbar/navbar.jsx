import { Box, Grid } from "@mui/material";
import "./navbar.css"

const Navbar = () => {

    return(
        <>
         <Box className="navbarBox">
          <Grid container alignItems="center">
            <Grid item xs={8} md={10}>
              asd
            </Grid>
            <Grid item xs={2} md={1}>
              profile
            </Grid>
            <Grid item xs={2} md={1}>
              Logout
            </Grid>
           
          </Grid>
        </Box>
        </>
    )
}

export default Navbar;