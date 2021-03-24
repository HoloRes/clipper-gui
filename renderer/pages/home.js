import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player'
import Input from "@material-ui/core/Input";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const Home = () => {
  const classes = useStyles({});
  const [clips, setClips] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gi

  function handleClip() {

  }

  return (
    <React.Fragment>
      <Head>
        <title>Clipper tool</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Clipper
        </Typography>
          {videoUrl && urlRegex.test(videoUrl) && <ReactPlayer url={videoUrl}/>}
          <Input placeholder="Video URL" value={videoUrl} error={!urlRegex.test(videoUrl)} onChange={(event) => setVideoUrl(event.target.value)} />
        <br/>
        <Button variant="contained" color="secondary" onClick={handleClip} disabled={true}>
          Clip
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Home;
