"use client"
import React, { useState, useEffect, useRef } from 'react';

export default function CreatePage() {
  const [zoom, setZoom] = useState(100);
  const gridSize = 40; // Fixed grid size
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const handleWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(zoom + delta * zoom, 25), 400);

    const scale = newZoom / zoom;
    const newOffset = {
      x: x - scale * (x - offset.x),
      y: y - scale * (y - offset.y)
    };

    setZoom(Number(newZoom.toFixed(2)));
    setOffset(newOffset);
  };

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gray-100"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 3px, transparent 3px)',
            backgroundSize: `${gridSize}px ${gridSize}px`,
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
          }}
        />
        
        {/* Draggable item */}
        <DraggableItem gridSize={gridSize} zoom={zoom} offset={offset} />
      </div>

      {/* Zoom indicator */}
      <div className="fixed top-4 right-4 bg-white text-black p-2 rounded shadow z-10">
        Zoom: {zoom.toFixed(2)}%
      </div>
    </div>
  );
}

function DraggableItem({ gridSize, zoom, offset }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const rect = e.target.getBoundingClientRect();
    setDragStart({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const scale = zoom / 100;
      const newX = Math.round((e.clientX - dragStart.x - offset.x) / (gridSize * scale)) * gridSize;
      const newY = Math.round((e.clientY - dragStart.y - offset.y) / (gridSize * scale)) * gridSize;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, zoom, offset]);

  return (
    <div
      className="absolute bg-blue-500 rounded cursor-move"
      style={{
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        left: position.x,
        top: position.y,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
    />
  );
}