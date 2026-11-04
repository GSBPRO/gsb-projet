import useLightParticles from './useLightParticles.js';
import './LightParticles.css';

// Petits points de lumière flous qui montent doucement dans le ciel. Purement décoratif.
export default function LightParticles({ count = 20 }) {
  const particles = useLightParticles(count);

  return (
    <div className="light-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="light-particles__dot"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            '--sway': `${particle.sway}px`,
            '--max-opacity': particle.opacity,
          }}
        />
      ))}
    </div>
  );
}
