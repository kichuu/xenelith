"use client";

import { useEffect, useRef } from "react";

export function DnaVisualization({ progress }: { progress: number }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = 300;
		const height = 300;
		canvas.width = width;
		canvas.height = height;

		let animFrame: number;
		const nodes: {
			x: number;
			y: number;
			vx: number;
			vy: number;
			active: boolean;
		}[] = [];

		// Generate nodes in a DNA-like pattern
		for (let i = 0; i < 24; i++) {
			const angle = (i / 24) * Math.PI * 4;
			const radius = 60 + Math.sin(angle * 2) * 30;
			nodes.push({
				x: width / 2 + Math.cos(angle) * radius,
				y: height / 2 + Math.sin(angle) * radius,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				active: (i / 24) * 100 <= progress,
			});
		}

		function draw() {
			if (!ctx) return;
			frameRef.current += 0.01;

			ctx.clearRect(0, 0, width, height);

			// Update and draw connections
			for (let i = 0; i < nodes.length; i++) {
				const node = nodes[i];
				node.x += node.vx;
				node.y += node.vy;

				// Soft boundary bounce
				if (node.x < 40 || node.x > width - 40) node.vx *= -1;
				if (node.y < 40 || node.y > height - 40) node.vy *= -1;

				node.active = (i / nodes.length) * 100 <= progress;

				// Draw connections to nearby nodes
				for (let j = i + 1; j < nodes.length; j++) {
					const other = nodes[j];
					const dx = other.x - node.x;
					const dy = other.y - node.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < 100) {
						const alpha = (1 - dist / 100) * 0.3;
						ctx.strokeStyle =
							node.active && other.active
								? `rgba(115, 210, 200, ${alpha})`
								: `rgba(255, 255, 255, ${alpha * 0.2})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(node.x, node.y);
						ctx.lineTo(other.x, other.y);
						ctx.stroke();
					}
				}
			}

			// Draw nodes
			for (const node of nodes) {
				const glow = node.active ? 8 : 0;
				if (glow > 0) {
					ctx.shadowColor = "rgba(115, 210, 200, 0.6)";
					ctx.shadowBlur = glow;
				}

				ctx.fillStyle = node.active
					? "rgba(115, 210, 200, 0.9)"
					: "rgba(255, 255, 255, 0.15)";
				ctx.beginPath();
				ctx.arc(node.x, node.y, node.active ? 3 : 2, 0, Math.PI * 2);
				ctx.fill();

				ctx.shadowBlur = 0;
			}

			animFrame = requestAnimationFrame(draw);
		}

		draw();

		return () => cancelAnimationFrame(animFrame);
	}, [progress]);

	return (
		<canvas
			ref={canvasRef}
			className="mx-auto size-[300px] opacity-80"
			style={{ imageRendering: "auto" }}
		/>
	);
}
