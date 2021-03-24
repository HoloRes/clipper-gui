import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
  const [videoUrl, setVideoUrl] = useState('');

  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gi;

  function handleClip() {}

  return (
    <>
      <Head>
        <title>Clipper tool</title>
      </Head>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Clipper
        </Typography>
        {videoUrl && urlRegex.test(videoUrl) && (
          <ReactPlayer
            url={videoUrl}
            light
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        )}
        <Input
          placeholder="Video URL"
          value={videoUrl}
          error={!urlRegex.test(videoUrl)}
          onChange={event => setVideoUrl(event.target.value)}
        />
        <br />
        <Typography>Clips:</Typography>
        <br />
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
