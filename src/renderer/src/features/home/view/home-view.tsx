import { useNavigate } from 'react-router';

import { Button } from '@/components/common/button';

function HomeView() {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/main')}>
        Go To Main
      </Button>
    </div>
  );
}

export default HomeView;
