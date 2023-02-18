import { Card, CardContent, IconButton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { searchActorsByName } from '../services/ExternService';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { Actor } from '../types/Actor';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useCookies } from 'react-cookie';
import ActorCardLarge from '../components/SingleItemComponents/ActorCardLarge';
import ActorMovieSearchBar from '../components/GeneralComponents/ActorMovieSearchBar';

export default function ActorSearchPage() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const { searchWord } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchWord !== undefined) {
      searchActorsByName(searchWord).then((res) => {
        setActors(res);
      });
    }
  }, [searchWord]);

  function toHomePage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    navigate('/home');
  }

  return (
    <>
      <Stack spacing={1} direction={'column'}>
        <Card>
          <CardContent>
            <Stack spacing={1} direction={'row'}>
              <IconButton onClick={toHomePage}>
                <HomeIcon />
              </IconButton>
              <ActorMovieSearchBar initialSearchWord={searchWord ?? ''} />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2 container spacing={0}>
              {actors != null ? (
                <>
                  {actors.map((actor) => (
                    <div key={actor.actorId}>
                      <ActorCardLarge actor={actor} />
                    </div>
                  ))}
                </>
              ) : (
                <></>
              )}
            </Grid2>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}
