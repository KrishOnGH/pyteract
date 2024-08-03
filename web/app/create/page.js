"use client"
import React, { useState, useEffect, useRef } from 'react';

export default function CreatePage() {
  const [itemPosition, setItemPosition] = useState({ x: 100, y: 100 });
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && containerRef.current && itemRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = itemRef.current.getBoundingClientRect();
        
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        // Constrain X position
        newX = Math.max(0, Math.min(newX, containerRect.width - itemRect.width));
        
        // Constrain Y position
        newY = Math.max(0, Math.min(newY, containerRect.height - itemRect.height));

        setItemPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - itemPosition.x, 
      y: e.clientY - itemPosition.y 
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Dot grid background */}
      <div 
        className="absolute inset-0 bg-white"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Draggable item */}
      <div
        ref={itemRef}
        className="absolute w-20 h-20 bg-blue-500 rounded cursor-move"
        style={{ left: `${itemPosition.x}px`, top: `${itemPosition.y}px` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}