/**
 * Hero film, shipped as a still-frame sequence and drawn to a canvas by scroll, never as <video>.
 *
 * Source: public/videos/hero-section-video.mp4 (1280x720, 24 fps, 6 s). Frames regenerated with,
 * from public/videos:
 *   ffmpeg -i hero-section-video.mp4 -vf "fps=24,scale=1920:-1" -c:v libwebp -quality 78 frames/f_%03d.webp
 * If the film changes, update frameCount to the number of files ffmpeg writes.
 */
export const heroSequence = {
  frameCount: 144,
  width: 1920,
  height: 1080,
  frame: (index: number) => `/videos/frames/f_${String(index + 1).padStart(3, "0")}.webp`,
  alt: "Saffron threads falling into an open jar of Zaravan Super Negin.",
};
