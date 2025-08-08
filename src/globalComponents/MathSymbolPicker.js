import React from 'react';

const mathSymbols = [
  // Arithmetic & Operators
  '+', '−', '±', '×', '÷', '=', '≠', '<', '>', '≤', '≥', '^', '%',
  '∓', '∔', '∕', '∖', '∗', '∘', '∙', '⋅',

  // Algebra
  '∛', '∜', '√', '∑', '∏', '∐', '∅', '∂', '∆', '∇',

  // Logic
  '¬', '∧', '∨', '⊕', '⊗', '⊘', '⊙', '⇒', '⇔', '⇐', '⇑', '⇓', '⇔', '⇕', '⊢', '⊨', '⊣',

  // Set Theory
  '∈', '∉', '∋', '∌', '∪', '∩', '⊂', '⊃', '⊆', '⊇', '⊄', '⊅', '∖',

  // Quantifiers
  '∀', '∃', '∄',

  // Geometry
  '∠', '∟', '⊥', '∥', '∡', '⊾', '⦜',

  // Arrows
  '→', '←', '↑', '↓', '↔', '↕', '⇒', '⇐', '⇑', '⇓', '⇔', '⇕',

  // Misc
  '∞', '≈', '≡', '≅', '≃', '∝', '∴', '∵', '|', '‖', '∥', '⋮', '⋯', '⋱', '⋰',

  // Greek Letters (Lowercase)
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ',
  'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ',
  'φ', 'χ', 'ψ', 'ω',

  // Greek Letters (Uppercase)
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ',
  'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ',
  'Φ', 'Χ', 'Ψ', 'Ω',

  // Arrows (extended)
  '↦', '↩', '↪', '⇄', '⇆', '⇉', '⇋', '⟶', '⟵', '⟷',

  // Brackets & Fences
  '(', ')', '[', ']', '{', '}', '⟨', '⟩', '⌈', '⌉', '⌊', '⌋',

  // Currency and misc symbols
  '$', '€', '£', '₹', '©', '™', '°', '‰', 'µ'
];


const MathSymbolPicker = ({ onSelect, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1000,
        width: '800px', // ✅ Corrected here
      }}
    >
      {/* Scrollable container */}
      <div
        style={{
          maxHeight: '10rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
          gap: '6px',
        }}
      >
        {mathSymbols.map((symbol, i) => (
          <button
            key={i}
            onClick={() => onSelect(symbol)}
            style={{
              padding: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f7f7f7',
            }}
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* Fixed Close Button */}
      <button
        onClick={onClose}
        style={{
          marginTop: '10px',
          background: 'red',
          color: 'white',
          padding: '5px',
          border: 'none',
          borderRadius: '4px',
          width: '100%',
        }}
      >
        Close
      </button>
    </div>
  );
};

export default MathSymbolPicker;
