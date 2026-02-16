import React from 'react';
import './ServerDown.css';

function ServerDown({ onRetry }) {
    return (
        <div className="server-down-container">
            <div className="server-down-content">
                {/* Crying Character */}
                <div className="crying-character">
                    <div className="character-head">
                        {/* Face */}
                        <div className="face">
                            {/* Eyes */}
                            <div className="eye left-eye">
                                <div className="pupil"></div>
                                <div className="tear tear-1"></div>
                                <div className="tear tear-2"></div>
                            </div>
                            <div className="eye right-eye">
                                <div className="pupil"></div>
                                <div className="tear tear-3"></div>
                                <div className="tear tear-4"></div>
                            </div>
                            {/* Sad Mouth */}
                            <div className="mouth"></div>
                            {/* Cheeks */}
                            <div className="cheek left-cheek"></div>
                            <div className="cheek right-cheek"></div>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="character-body">
                        <div className="arm left-arm"></div>
                        <div className="arm right-arm"></div>
                    </div>
                </div>

                {/* Server Icon */}
                <div className="server-icon">
                    <div className="server-rack">
                        <div className="server-light off"></div>
                        <div className="server-light off"></div>
                        <div className="server-light off"></div>
                    </div>
                    <div className="server-cable"></div>
                    <div className="broken-plug">
                        <span className="spark">⚡</span>
                    </div>
                </div>

                {/* Message */}
                <div className="error-message">
                    <h1 className="error-title">😢 Server is Shutdown</h1>
                    <p className="error-description">
                        Oops! Our server seems to be taking a nap...
                        <br />
                        Please try again in a few moments.
                    </p>

                    {/* Retry Button */}
                    <button className="retry-button" onClick={onRetry}>
                        <span className="retry-icon">🔄</span>
                        Try Again
                    </button>
                </div>

                {/* Floating Elements */}
                <div className="floating-elements">
                    <span className="floating-item item-1">💔</span>
                    <span className="floating-item item-2">😿</span>
                    <span className="floating-item item-3">🔌</span>
                    <span className="floating-item item-4">⚠️</span>
                </div>
            </div>
        </div>
    );
}

export default ServerDown;
