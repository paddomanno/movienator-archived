//Route: movienator3000.com/
import { Outlet } from 'react-router-dom';

export default function RootPage() {
  return (
    <div>
      <div className={'rootPage'}>Hier ist die Root Page</div>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
