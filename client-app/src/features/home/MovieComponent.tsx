import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Movies } from "../../app/Model/movie";
import { Grid, Card, Image } from "semantic-ui-react";

axios.defaults.baseURL = '';

const MovieComponent = () => {
  const [movie, Setmovies] = useState<Movies>();
  const movieObject = {
    getMovie: (): Promise<Movies> =>
      axios.get(
        "https://api.themoviedb.org/3/search/movie?api_key=1e0f621ccc824f14a1a437c0258cf30f&query=Jack+Reacher"
      ),
  };

  useEffect(() => {
    movieObject.getMovie().then((response) => {
      Setmovies(response);
      console.log(movie);
    });
  }, [Setmovies, movieObject]);
  return (
    <Fragment>
      <Grid width={16}>
        {movie?.results.map((res) => (
             <Grid.Column>
             <Card>
               <Image
                 src={`https://api.themoviedb.org${res.poster_path}`}
                 wrapped
                 ui={false}
               />
               <Card.Content>
        <Card.Header>{res.title}</Card.Header>
                 <Card.Meta>
        <span className="date">{res.release_date}</span>
                 </Card.Meta>
                 <Card.Description>
                   {res.overview}
                 </Card.Description>
               </Card.Content>
               <Card.Content extra>
                 {res.vote_count}
               </Card.Content>
             </Card>
           </Grid.Column>
        ))}
        </Grid>

       
    </Fragment>
  );
};

export default MovieComponent;
