"use client"
import React, { useState, useEffect, useRef } from 'react';

export default function InfiniteGridPage() {
  const [blocks, setBlocks] = useState([{ id: 1, x: 0, y: 0 }]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const gridSize = 20; // px

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedBlock !== null) {
        const newX = Math.round((e.clientX - dragStart.x) / (gridSize * viewport.zoom)) * gridSize;
        const newY = Math.round((e.clientY - dragStart.y) / (gridSize * viewport.zoom)) * gridSize;
        setBlocks(blocks.map(block => 
          block.id === draggedBlock ? { ...block, x: newX, y: newY } : block
        ));
      } else if (isDraggingViewport) {
        setViewport(prev => ({
          ...prev,
          x: prev.x + (dragStart.x - e.clientX) / prev.zoom,
          y: prev.y + (dragStart.y - e.clientY) / prev.zoom
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggedBlock(null);
      setIsDraggingViewport(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedBlock, isDraggingViewport, dragStart, blocks, viewport.zoom]);

  const handleMouseDown = (e, blockId = null) => {
    if (blockId !== null) {
      setDraggedBlock(blockId);
    } else {
      setIsDraggingViewport(true);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(10, prev.zoom * (1 - e.deltaY * 0.001)))
    }));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white"
      onMouseDown={(e) => handleMouseDown(e)}
      onWheel={handleWheel}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: `${gridSize * viewport.zoom}px ${gridSize * viewport.zoom}px`,
          backgroundPosition: `${-viewport.x * viewport.zoom}px ${-viewport.y * viewport.zoom}px`,
          transform: `scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      />
      
      {blocks.map(block => (
        <div
          key={block.id}
          className="absolute w-20 h-20 bg-blue-500 rounded cursor-move"
          style={{
            left: `${(block.x - viewport.x) * viewport.zoom}px`,
            top: `${(block.y - viewport.y) * viewport.zoom}px`,
            transform: `scale(${viewport.zoom})`,
            transformOrigin: '0 0'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, block.id);
          }}
        />
      ))}
    </div>
  );
}