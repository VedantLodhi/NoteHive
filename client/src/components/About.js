import React from "react";
import "../css/About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About NoteHive</h1>
        <p>
          A calm, editorial workspace for notes, quizzes, and personal study—built with clarity and longevity in mind.
        </p>
      </div>
      <div className="about-content">
        <p>
          NoteHive brings together structured note-taking and lightweight practice tools so you can capture ideas, revisit
          them with ease, and reinforce learning without visual noise.
        </p>

        <div className="features">
          <h2>Highlights</h2>
          <ul>
            <li>Minimal interface with generous typography and spacing</li>
            <li>Light and dark appearances tuned for comfortable contrast</li>
            <li>Responsive layouts from mobile to wide desktop</li>
            <li>Notes, trivia, and profile in one cohesive experience</li>
          </ul>
        </div>

        <p>
          Crafted with <strong>React</strong> and a MERN stack, NoteHive focuses on readability, accessibility, and a
          premium editorial feel inspired by modern productivity platforms.
        </p>
      </div>

      <div className="about-footer">
        <p>
          Created by <strong>Vedant Lodhi</strong>
        </p>
        <p>&copy; 2026 NoteHive</p>
      </div>
    </div>
  );
};

export default About;
