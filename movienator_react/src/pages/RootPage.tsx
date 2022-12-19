//Route: movienator3000.com/
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';

export default function RootPage() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['userName']);

  function handleLogout(e: any) {
    e.preventDefault();
    if (cookies.userName) {
      removeCookie('userName');
      navigate('/login');
    }
  }

  return (
    <div>
      <div className={'rootPage'}>Hier ist die Root Page</div>
      {cookies.userName ? (
        <Button variant={'contained'} onClick={handleLogout}>
          Log Out
        </Button>
      ) : (
        <Typography>Please log in to use this website</Typography>
      )}
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
