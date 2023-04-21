import React, { Component } from 'react'

export class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
          review: '',
          typingTimer: null,
        };
        this.textareaRef = React.createRef();
        this.delay = 300; // Delay in milliseconds (0.3 seconds)
    }
    typing = (e) => {
        this.setState({ review: e.target.value });
        // this.update_after_delay(e.target.value);
    };
    handleTextareaResize = () => {
        this.textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate actual height
        this.textareaRef.current.style.height = `${
          this.textareaRef.current.scrollHeight
        }px`; // Set height to actual height
    };
    render() {
        return (
            <div>
                <textarea
                ref={this.textareaRef}
                className="AlbumReviewBox"
                placeholder="No Review Written"
                value={this.state.review}
                onChange={this.typing}
                onInput={this.handleTextareaResize}
                wrap="soft"
                ></textarea>
            </div>
        )
    }
}

export default TextInput