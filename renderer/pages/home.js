import React, {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      textAlign: 'center',
    },
  })
);

export default function Home() {
  const classes = useStyles({});
  const [clips, setClips] = useState([]);
  const [clipsHtml, setClipsHtml] = useState([]);
  const [currentClip, setCurrentClip] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const playerRef = useRef();

  function secondParser(hms) {
    const a = hms.split(':');
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
  }

  function timestampParser(seconds) {
    const date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  }

  function handleClip() {}

  function clipTimestamp() {
    const clip = [...currentClip];
    clip.push(playerRef.getCurrentTime());
    setCurrentClip(clip);
    if(currentClip[0]) {
      const newClips = [...clips];
      newClips.push(clip);
      setClips(newClips);
      setCurrentClip([]);
    }
  }

  useEffect(() => {
    console.log(clips);
  }, [clips])

  return (
    <>
      <Head>
        <title>Clipper tool</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Clipper
        </Typography>
        {videoUrl && ReactPlayer.canPlay(videoUrl) && (
          <ReactPlayer
            url={videoUrl}
            ref={playerRef}
            light
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        )}
        <Input
          placeholder="Video URL"
          value={videoUrl}
          error={!ReactPlayer.canPlay(videoUrl)}
          onChange={event => setVideoUrl(event.target.value)}
        />
        <br/>
        <br/>
        <Button
            variant="contained"
            color="secondary"
            onClick={clipTimestamp}
            disabled={!ReactPlayer.canPlay(videoUrl) || !playerRef?.getCurrentTime || playerRef?.getCurrentTime() === null}
        >
          { currentClip.length > 0 ? "End clip" : "Start clip" }
        </Button>
        <br/>
        <br/>
        <Typography>Clips:</Typography>
        <br />
        <Grid item xs={12}>
          <Grid container justify="center" alignItems="center">
            <Typography>1:</Typography>
            {/* Can't get spacing to work */}
            <Input style={{ marginLeft: '2vw' }} placeholder="Start time" />
            <Input style={{ marginLeft: '2vw' }} placeholder="End time" />
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Typography>2:</Typography>
            <Input style={{ marginLeft: '2vw' }} placeholder="Start time" />
            <Input style={{ marginLeft: '2vw' }} placeholder="End time" />
          </Grid>
          <IconButton
            variant="contained"
            onClick={() => {
              /* Adds row for another clip */
            }}
            color="primary"
            aria-label="Add clip"
            disabled
          >
            <Add />
          </IconButton>
        </Grid>

        <br />
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClip}
          disabled
        >
          Clip
        </Button>

        <br />
        <Typography>Should only show during clipping of course</Typography>
        <LinearProgress variant="determinate" value={30} />
      </div>
    </>
  );
}
