import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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
  const [inVidClippingAvailable, setInVidClippingAvailable] = useState(false);
  const [addClipAvailable, setAddClipAvailable] = useState(false);
  const [errors, setErrors] = useState([]);
  const playerRef = useRef(null);

  function secondParser(hms) {
    const a = hms.split(':');
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  }

  function timestampParser(seconds) {
    const date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  }

  const addClip = () => setClips([...clips, [,]]);

  useEffect(() => {
    setAddClipAvailable(
      clips?.length > 0
        ? clips[clips.length - 1].length === 2 && ReactPlayer.canPlay(videoUrl)
        : ReactPlayer.canPlay(videoUrl)
    );
  }, [clips, videoUrl]);

  function clipTimestamp() {
    const clip = [...currentClip];
    clip.push(Math.round(playerRef?.current.getCurrentTime()));
    setCurrentClip(clip);
    if (currentClip[0]) {
      const newClips = [...clips];
      newClips.push(clip);
      setClips(newClips);
      setCurrentClip([]);
    }
  }

  function checkInVidClippingAvailable() {
    setInVidClippingAvailable(
      ReactPlayer.canPlay(videoUrl) &&
        playerRef?.current.getCurrentTime &&
        playerRef?.current.getCurrentTime() !== null
    );
  }

  useEffect(() => {
    function removeClip(index) {
      const newClips = [...clips];
      newClips.splice(index, 1);
      setClips(newClips);
    }

    function updateTimestamp(event, index, timestamp) {
      const newClips = [...clips];
      newClips[index][timestamp] = event.target.value;
      setClips(newClips);
    }

    const checkValidTimestamp = timestamp =>
      timestampParser(timestamp) === 'Invalid Date'
        ? timestampParser(secondParser(timestamp)) !== 'Invalid Date'
        : true;

    const valid = clips.map(clip => clip.map(checkValidTimestamp));

    const timestamps = clips.map(clip =>
      clip.map(timestamp =>
        timestampParser(timestamp) === 'Invalid Date'
          ? timestampParser(secondParser(timestamp)) === 'Invalid Date'
            ? timestamp
            : timestampParser(secondParser(timestamp))
          : timestampParser(timestamp)
      )
    );

    // TODO: Add timestamp validation (check if < 0, > video duration or if the end timestamp isn't lower than begin timestamp)
    const newHtml = clips.map((clip, index) => (
      <Grid container justify="center" alignItems="center" key={index}>
        <Typography>{index + 1}:</Typography>
        <Input
          style={{ marginLeft: '2vw' }}
          placeholder="Start time"
          value={timestamps[index][0]}
          error={!valid[index][0]}
          onChange={event => {
            updateTimestamp(event, index, 0);
          }}
        />
        <Input
          style={{ marginLeft: '2vw' }}
          placeholder="End time"
          value={timestamps[index][1]}
          error={!valid[index][1]}
          onChange={event => {
            updateTimestamp(event, index, 1);
          }}
        />
        <IconButton
          color="primary"
          aria-label="Delete this clip"
          component="span"
          onClick={() => removeClip(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    ));

    setClipsHtml(newHtml);
  }, [clips]);

  return (
    <>
      <Head>
        <title>Clipper tool</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Clipper
        </Typography>
        <ReactPlayer
          url={videoUrl}
          ref={playerRef}
          onReady={checkInVidClippingAvailable}
          onClickPreview={checkInVidClippingAvailable}
          onPlay={checkInVidClippingAvailable}
          onStart={checkInVidClippingAvailable}
          light
          controls
          volume={0.5}
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <Input
          placeholder="Video URL"
          value={videoUrl}
          error={!ReactPlayer.canPlay(videoUrl)}
          onChange={event => setVideoUrl(event.target.value)}
        />
        <br />
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={clipTimestamp}
          disabled={!inVidClippingAvailable}
        >
          {currentClip.length > 0 ? 'End clip' : 'Start clip'}
        </Button>
        <br />
        <br />
        <Typography>Clips:</Typography>
        <br />
        <Grid item xs={12}>
          {clipsHtml}

          <IconButton
            variant="contained"
            onClick={addClip}
            color="primary"
            aria-label="Add clip"
            disabled={!addClipAvailable}
          >
            <AddIcon />
          </IconButton>
        </Grid>

        <br />
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            /* Start download */
          }}
          disabled={
            !(
              ReactPlayer.canPlay(videoUrl) &&
              clips.length > 0 &&
              errors.indexOf(true) === -1
            )
          }
        >
          Clip
        </Button>

        <br />
        {/* Should only show during clipping of course */}
        <LinearProgress variant="determinate" value={30} />
      </div>
    </>
  );
}
