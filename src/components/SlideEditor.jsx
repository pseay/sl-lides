import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const SlideEditor = ({ slides, setSlides, onSave }) => {
  const [selectedSlideId, setSelectedSlideId] = useState(null);
  const [editMode, setEditMode] = useState('visual'); // 'visual' or 'html'
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Find the currently selected slide object
  const selectedSlide = slides.find(s => s.id === selectedSlideId);

  const handleAddSlide = () => {
    const newSlide = {
      id: crypto.randomUUID(),
      type: 'content',
      title: 'New Slide',
      content: '',
      elements: [
          {
            id: crypto.randomUUID(),
            type: 'text',
            content: 'New Text Block',
            style: { fontSize: '16px', color: '#FFFFFF' }
          }
      ],
      layout: {
          direction: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          gap: '1rem'
      },
      language: 'javascript',
      initialCode: '// code here',
      solution: '// solution here'
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setSelectedSlideId(newSlide.id);
    onSave(newSlides);
  };

  const handleDeleteSlide = (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      const newSlides = slides.filter(s => s.id !== id);
      setSlides(newSlides);
      if (selectedSlideId === id) {
        setSelectedSlideId(null);
      }
      onSave(newSlides);
    }
  };

  const handleMoveSlide = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newSlides = [...slides];
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
      setSlides(newSlides);
      onSave(newSlides);
    } else if (direction === 'down' && index < slides.length - 1) {
      const newSlides = [...slides];
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
      setSlides(newSlides);
      onSave(newSlides);
    }
  };

  const handleUpdateSlide = (id, field, value) => {
    const newSlides = slides.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    setSlides(newSlides);
    onSave(newSlides);
  };

  const handleUpdateSlideLayout = (field, value) => {
      if (!selectedSlide) return;
      const currentLayout = selectedSlide.layout || { direction: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '1rem' };
      handleUpdateSlide(selectedSlideId, 'layout', { ...currentLayout, [field]: value });
  };

  // Visual Editor Functions
  const handleAddElement = (type) => {
    if (!selectedSlide) return;
    const newElement = {
        id: crypto.randomUUID(),
        type,
        content: type === 'text' ? 'New Text Block' : (type === 'image' ? 'https://via.placeholder.com/150' : undefined),
        items: type === 'list' ? ['Item 1', 'Item 2', 'Item 3'] : undefined,
        style: {
            fontSize: '16px',
            color: '#FFFFFF',
            // Default styles, layout is handled by container
        }
    };
    const updatedElements = [...(selectedSlide.elements || []), newElement];
    handleUpdateSlide(selectedSlideId, 'elements', updatedElements);
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (elId, updates) => {
      if (!selectedSlide || !selectedSlide.elements) return;
      const updatedElements = selectedSlide.elements.map(el => 
          el.id === elId ? { ...el, ...updates } : el
      );
      handleUpdateSlide(selectedSlideId, 'elements', updatedElements);
  };
  
  const handleUpdateElementStyle = (elId, styleUpdates) => {
      if (!selectedSlide || !selectedSlide.elements) return;
      const updatedElements = selectedSlide.elements.map(el => 
          el.id === elId ? { ...el, style: { ...el.style, ...styleUpdates } } : el
      );
      handleUpdateSlide(selectedSlideId, 'elements', updatedElements);
  };

  const handleDeleteElement = (elId) => {
      if (!selectedSlide || !selectedSlide.elements) return;
      const updatedElements = selectedSlide.elements.filter(el => el.id !== elId);
      handleUpdateSlide(selectedSlideId, 'elements', updatedElements);
      if (selectedElementId === elId) setSelectedElementId(null);
  };

  const handleMoveElement = (index, direction) => {
      if (!selectedSlide || !selectedSlide.elements) return;
      const newElements = [...selectedSlide.elements];
      
      if (direction === 'up' && index > 0) {
          [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      } else if (direction === 'down' && index < newElements.length - 1) {
          [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      } else {
          return;
      }
      
      handleUpdateSlide(selectedSlideId, 'elements', newElements);
  };

  const selectedElement = selectedSlide?.elements?.find(el => el.id === selectedElementId);
  const currentLayout = selectedSlide?.layout || { direction: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly', gap: '1rem' };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-3 flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-bold text-text">Sling Slides Editor</h1>
        <div className="flex gap-3">
           <Link 
            to="/presenter" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Present
          </Link>
          <Link 
            to="/presentation" 
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Student View
          </Link>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar - Slide List */}
        <div className="w-64 bg-surface border-r border-border flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-border">
            <button 
              onClick={handleAddSlide}
              className="w-full py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
            >
              + Add Slide
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`p-3 border-b border-border cursor-pointer hover:bg-gray-700 flex justify-between items-center group ${selectedSlideId === slide.id ? 'bg-gray-700 border-l-4 border-l-blue-500' : ''}`}
                onClick={() => setSelectedSlideId(slide.id)}
              >
                <div className="truncate flex-grow pr-2">
                  <div className="text-xs text-gray-400 uppercase font-bold">{index + 1}. {slide.type}</div>
                  <div className="font-medium text-text truncate">{slide.title || 'Untitled'}</div>
                </div>
                <div className="hidden group-hover:flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleMoveSlide(index, 'up'); }}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleMoveSlide(index, 'down'); }}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    disabled={index === slides.length - 1}
                  >
                    ↓
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id); }}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-grow overflow-y-auto bg-background flex flex-col">
          {selectedSlide ? (
            <div className="flex h-full">
                {/* Configuration Panel (Left of Canvas) */}
                <div className="w-80 bg-surface border-r border-border p-6 overflow-y-auto flex-shrink-0">
                  <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Slide Type</label>
                        <select 
                          value={selectedSlide.type}
                          onChange={(e) => handleUpdateSlide(selectedSlide.id, 'type', e.target.value)}
                          className="w-full p-2 border border-border bg-background text-text rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="content">Content</option>
                          <option value="code">Code</option>
                          <option value="whiteboard">Whiteboard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                        <input 
                          type="text"
                          value={selectedSlide.title}
                          onChange={(e) => handleUpdateSlide(selectedSlide.id, 'title', e.target.value)}
                          className="w-full p-2 border border-border bg-background text-text rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      {selectedSlide.type === 'content' && (
                          <div className="pt-4 border-t border-border">
                                   <div className="space-y-6">
                                       {/* Layout Controls */}
                                       <div className="bg-background p-3 rounded border border-border">
                                           <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Layout</h4>
                                           <div className="space-y-4">
                                               <div>
                                                   <label className="block text-xs font-medium text-text-secondary mb-1">Direction</label>
                                                   <div className="flex mt-1">
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border border-r-0 rounded-l ${currentLayout.direction === 'row' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('direction', 'row')}
                                                       >Row</button>
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border rounded-r ${currentLayout.direction === 'column' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('direction', 'column')}
                                                       >Column</button>
                                                   </div>
                                               </div>
                                               <div>
                                                   <label className="block text-xs font-medium text-text-secondary mb-1">Vertical Alignment</label>
                                                   <div className="flex mt-1">
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border border-r-0 rounded-l ${currentLayout.alignItems === 'flex-start' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('alignItems', 'flex-start')}
                                                       >Top</button>
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border rounded-r ${currentLayout.alignItems === 'center' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('alignItems', 'center')}
                                                       >Centered</button>
                                                   </div>
                                               </div>
                                               <div>
                                                   <label className="block text-xs font-medium text-text-secondary mb-1">Horizontal Distribution</label>
                                                   <div className="flex mt-1">
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border border-r-0 rounded-l ${currentLayout.justifyContent === 'flex-start' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('justifyContent', 'flex-start')}
                                                       >Left</button>
                                                       <button 
                                                           className={`flex-1 text-xs py-1 border rounded-r ${currentLayout.justifyContent === 'space-evenly' ? 'bg-blue-900 border-blue-700 text-blue-100' : 'bg-surface border-border text-text'}`}
                                                           onClick={() => handleUpdateSlideLayout('justifyContent', 'space-evenly')}
                                                       >Centered</button>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>

                                       {/* Element List & Add */}
                                       <div>
                                            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Elements</h4>
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                <button onClick={() => handleAddElement('text')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium text-center text-text">
                                                    + Text
                                                </button>
                                                <button onClick={() => handleAddElement('image')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium text-center text-text">
                                                    + Image
                                                </button>
                                                <button onClick={() => handleAddElement('list')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium text-center text-text">
                                                    + List
                                                </button>
                                            </div>

                                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                                {selectedSlide.elements?.map((el, index) => (
                                                    <div 
                                                        key={el.id}
                                                        onClick={() => setSelectedElementId(el.id)}
                                                        className={`p-2 text-sm border rounded flex justify-between items-center cursor-pointer ${selectedElementId === el.id ? 'border-blue-500 bg-gray-700' : 'border-border hover:bg-gray-700 text-text'}`}
                                                    >
                                                        <span className="truncate w-24">{el.type}</span>
                                                        <div className="flex gap-1">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleMoveElement(index, 'up'); }}
                                                                disabled={index === 0}
                                                                className="text-gray-400 hover:text-gray-200 px-1"
                                                            >↑</button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleMoveElement(index, 'down'); }}
                                                                disabled={index === (selectedSlide.elements?.length || 0) - 1}
                                                                className="text-gray-400 hover:text-gray-200 px-1"
                                                            >↓</button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                                                                className="text-red-400 hover:text-red-500 px-1"
                                                            >×</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                       </div>

                                       {selectedElement && (
                                           <div className="bg-gray-800 p-4 rounded border border-border space-y-3">
                                               <div className="flex justify-between items-center">
                                                   <h4 className="font-medium text-blue-400 text-sm">Element Settings</h4>
                                               </div>
                                               
                                               {selectedElement.type === 'text' && (
                                                   <div>
                                                       <label className="block text-xs font-medium text-text-secondary mb-1">Content</label>
                                                       <textarea 
                                                            value={selectedElement.content}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                                                            className="w-full p-2 text-sm border border-border bg-background text-text rounded"
                                                            rows={5}
                                                       />
                                                   </div>
                                               )}

                                               {selectedElement.type === 'image' && (
                                                   <div>
                                                       <label className="block text-xs font-medium text-text-secondary mb-1">Image URL</label>
                                                       <input 
                                                            type="text"
                                                            value={selectedElement.content}
                                                            onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                                                            className="w-full p-2 text-sm border border-border bg-background text-text rounded"
                                                            placeholder="https://..."
                                                       />
                                                   </div>
                                               )}

                                               {selectedElement.type === 'list' && (
                                                   <div>
                                                       <label className="block text-xs font-medium text-text-secondary mb-1">List Items</label>
                                                       <div className="space-y-2">
                                                            {selectedElement.items?.map((item, i) => (
                                                                <div key={i} className="flex gap-1">
                                                                    <input 
                                                                        type="text" 
                                                                        value={item}
                                                                        onChange={(e) => {
                                                                            const newItems = [...selectedElement.items];
                                                                            newItems[i] = e.target.value;
                                                                            handleUpdateElement(selectedElement.id, { items: newItems });
                                                                        }}
                                                                        className="flex-grow p-1 text-sm border border-border bg-background text-text rounded"
                                                                    />
                                                                    <button 
                                                                        onClick={() => {
                                                                            const newItems = selectedElement.items.filter((_, idx) => idx !== i);
                                                                            handleUpdateElement(selectedElement.id, { items: newItems });
                                                                        }}
                                                                        className="text-red-400 hover:text-red-600 px-1"
                                                                    >×</button>
                                                                </div>
                                                            ))}
                                                            <button 
                                                                onClick={() => {
                                                                    const newItems = [...(selectedElement.items || []), 'New Item'];
                                                                    handleUpdateElement(selectedElement.id, { items: newItems });
                                                                }}
                                                                className="w-full py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-text"
                                                            >
                                                                + Add Item
                                                            </button>
                                                       </div>
                                                   </div>
                                               )}

                                                <div>
                                                    <label className="block text-xs font-medium text-text-secondary mb-1">Font Size (px)</label>
                                                    <input 
                                                        type="number" 
                                                        value={parseInt(selectedElement.style?.fontSize) || 16}
                                                        onChange={(e) => handleUpdateElementStyle(selectedElement.id, { fontSize: e.target.value + 'px' })}
                                                        className="w-full p-2 text-sm border border-border bg-background text-text rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-text-secondary mb-1">Color</label>
                                                    <input 
                                                        type="color" 
                                                        value={selectedElement.style?.color || '#000000'}
                                                        onChange={(e) => handleUpdateElementStyle(selectedElement.id, { color: e.target.value })}
                                                        className="w-full h-8 p-0 border border-border rounded"
                                                    />
                                                </div>
                                                
                                                {selectedElement.type === 'image' && (
                                                     <div>
                                                        <label className="block text-xs font-medium text-text-secondary mb-1">Width (px)</label>
                                                        <input 
                                                            type="number" 
                                                            value={parseInt(selectedElement.style?.width) || 200}
                                                            onChange={(e) => handleUpdateElementStyle(selectedElement.id, { width: e.target.value + 'px' })}
                                                            className="w-full p-2 text-sm border border-border bg-background text-text rounded"
                                                        />
                                                    </div>
                                                )}
                                           </div>
                                       )}
                                   </div>
                          </div>
                      )}

                      {selectedSlide.type === 'code' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Language</label>
                            <select 
                              value={selectedSlide.language || 'javascript'}
                              onChange={(e) => handleUpdateSlide(selectedSlide.id, 'language', e.target.value)}
                              className="w-full p-2 border border-border bg-background text-text rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="cpp">C++</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Initial Code</label>
                            <textarea 
                              value={selectedSlide.initialCode || ''}
                              onChange={(e) => handleUpdateSlide(selectedSlide.id, 'initialCode', e.target.value)}
                              className="w-full h-48 p-2 border border-border bg-background text-text rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Solution Code</label>
                            <textarea 
                              value={selectedSlide.solution || ''}
                              onChange={(e) => handleUpdateSlide(selectedSlide.id, 'solution', e.target.value)}
                              className="w-full h-48 p-2 border border-border bg-background text-text rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedSlide.type === 'whiteboard' && (
                        <div className="p-4 bg-background rounded border border-border text-center text-text-secondary">
                          Whiteboard slides do not have content configuration.
                        </div>
                      )}
                  </div>
                </div>

                {/* Canvas / Preview Area */}
                <div className="flex-grow bg-background overflow-hidden relative flex flex-col">
                    <div className="p-4 bg-surface border-b border-border text-center text-sm font-medium text-text-secondary shadow-sm">
                        Slide Preview
                    </div>
                    
                    <div className="flex-grow p-8 overflow-auto flex justify-center items-start">
                        {/* Canvas Container */}
                        <div 
                            className="bg-surface shadow-lg relative flex flex-col"
                            style={{
                                width: '960px', 
                                height: '540px', // 16:9 aspect ratio
                                transformOrigin: 'top center',
                                transform: 'scale(0.8)', // Scale down slightly to fit
                                color: '#E5E7EB' // Force text color in preview
                            }}
                        >
                             {/* Slide Title Rendered in Canvas */}
                             <div className="p-8 border-b border-border flex-shrink-0">
                                 <h2 className="text-4xl font-bold text-text">{selectedSlide.title}</h2>
                             </div>

                             {/* Content Area */}
                             <div className="flex-grow relative p-8 overflow-hidden">
                                {selectedSlide.type === 'content' && (
                                    selectedSlide.elements ? (
                                        <div 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: currentLayout.direction,
                                                alignItems: currentLayout.alignItems,
                                                justifyContent: currentLayout.justifyContent,
                                                gap: currentLayout.gap,
                                            }}
                                        >
                                            {selectedSlide.elements.map(el => (
                                                <div
                                                    key={el.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                                                    style={{
                                                        border: selectedElementId === el.id ? '2px solid #3b82f6' : '1px dashed transparent',
                                                        padding: '4px',
                                                        maxWidth: '100%',
                                                        ...el.style
                                                    }}
                                                    className="hover:border-gray-500 transition-colors cursor-pointer"
                                                >
                                                    {el.type === 'text' && (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{el.content}</div>
                                                    )}
                                                    {el.type === 'list' && (
                                                        <ul className="list-disc list-inside space-y-2 text-left" style={{ fontSize: el.style?.fontSize || 'inherit', color: el.style?.color || 'inherit' }}>
                                                            {el.items && el.items.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {el.type === 'image' && (
                                                        <img src={el.content} alt="slide element" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', ...el.style}} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedSlide.content }} />
                                    )
                                )}

                                {(selectedSlide.type === 'code' || selectedSlide.type === 'whiteboard') && (
                                    <div className="flex items-center justify-center h-full text-gray-400 bg-background border border-dashed border-border rounded">
                                        {selectedSlide.type === 'code' ? 'Code Editor Placeholder' : 'Whiteboard Placeholder'}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary">
              Select a slide to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
