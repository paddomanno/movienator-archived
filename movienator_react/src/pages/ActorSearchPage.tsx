import { Card, CardContent, IconButton, Paper, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { searchActorsByName } from '../services/ExternService';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { Actor } from '../types/Actor';
import Grid2 from '@mui/material/Unstable_Grid2';
import ActorSearchBar from '../components/ActorSearchBar';
import { useCookies } from 'react-cookie';
import SingleActorLarge from '../components/SingleItemComponents/SingleActorLarge';

export default function ActorSearchPage() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const { searchWord } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    if (searchWord != undefined) {
      searchActorsByName(searchWord).then((res) => {
        setActors(res);
      });
    }
  }, [searchWord]);

  function toHomePage(e: any) {
    e.preventDefault();
    navigate('/home');
  }

  function toActorPage(actorId: number) {
    navigate('/actor/' + actorId);
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
              <ActorSearchBar data={searchWord} />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2 container spacing={1}>
              {actors != null ? (
                <>
                  {actors.map((actor) => (
                    <Grid2>
                      <SingleActorLarge data={actor} />
                    </Grid2>
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
