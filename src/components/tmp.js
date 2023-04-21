import React, { Component } from 'react';
import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as config from './config';
import './AlbumReview.css';

import db from './Firebase';
import { ref, set, onValue } from 'firebase/database';

const arrow = (
  <svg
    style={{ height: '16px' }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const HorizonLine = (
  <div
    style={{
      width: '30%',
      textAlign: 'center',
      borderBottom: '1px solid #aaa',
      lineHeight: '0.1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '20px',
      marginBottom: '20px',
    }}
  ></div>
);

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class AlbumReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: {},
      bgImage: '',
      review: '',
      typingTimer: null,
    };
    this.id = this.props.params.id;
    this.albumId = this.props.params.albumId;
    this.textareaRef = React.createRef();
    this.delay = 300; // Delay in milliseconds (0.3 seconds)
  }

  handleTextareaResize = () => {
    this.textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate actual height
    this.textareaRef.current.style.height = `${
      this.textareaRef.current.scrollHeight
    }px`; // Set height to actual height
  };

  typing = (e) => {
    this.setState({ review: e.target.value });
    this.update_after_delay(e.target.value);
  };

  update_after_delay(current_review) {
    // Reset the timer on every keyup event
    clearTimeout(this.state.typingTimer);

    // Start a new timer for delay milliseconds
    const tmp = setTimeout(() => {
      // Run your function here after delay milliseconds
      // This function will run only if user stops typing for delay milliseconds
      console.log('User stopped typing');
      // Call your function here that you want to run after typing delay
      // For example: myFunction();
      set(ref(db, `/${this.props.id}/albums/${this.props.albumId}/review`), current_review);
    }, this.delay);

    this.setState({ typingTimer: tmp });
  }

  componentDidMount() {
    const albumRef = ref(db, `${this.id}/albums/${this.albumId}`);
  
    onValue(albumRef, (snapshot) => {
      const album = snapshot.val();
      if (album) { // Add null check
        this.setState({
          album: album,
          bgImage: album.artworkLarge,
          review: album.review
        });
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.state.typingTimer);
  }

  render() {
    const { bgImage} = this.state;

    var releaseDate = new Date(this.state.album.releaseDate);

    releaseDate = `${releaseDate.getFullYear()}/${releaseDate.getMonth()}/${releaseDate.getDate()}`;
    return (
      <div style={{backgroundImage: `url(${bgImage})`, display:'flex'}} className="AlbumReviewPage">
      <span className="AlbumArtworkBox">
        <div>
          <div className="return">
            <Link to={`/${this.id}`} style={{textDecoration:'none'}}>
              {arrow}
              {"  Return to the Main Page"}
            </Link>
          </div>
          <img className= "AlbumArtwork" src={bgImage}></img>
        </div>
      </span>
      <span className="AlbumInfoBox">
        <div className="AlbumTitle">{this.state.album.albumName}</div>
        <div>
          <span className="AlbumAtribute">Artist</span>
          <span>{this.state.album.artistName}</span>
        </div>
        <div>
          <span className="AlbumAtribute">Released</span>
          <span>{releaseDate}</span>
        </div>
        <div>
          <span className="AlbumAtribute">Genre</span>
          <span>{this.state.album.genre}</span>
        </div>
        <div>
          <span className="AlbumAtribute">Tracks</span>
          <span>{this.state.album.trackCount}</span>
        </div>
        <div>
          <span className="AlbumAtribute">Rank</span>
          <span>asdfg</span>
        </div>
        {HorizonLine}
        <textarea
          ref={this.textareaRef}
          className="AlbumReviewBox"
          placeholder="No Review Written"
          value={this.state.review}
          onChange={this.typing}
          onInput={this.handleTextareaResize}
          wrap="soft"
        ></textarea>
      </span>
    </div>
    );
  }
}

export default withParams(AlbumReviewPage);