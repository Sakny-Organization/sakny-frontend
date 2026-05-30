import React, { useRef, useState } from 'react';

const OTPInput = ({ length = 6, onChange }) => {
    const [values, setValues] = useState(Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (index, e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (!val) return;
        const char = val[val.length - 1];
        const next = [...values];
        next[index] = char;
        setValues(next);
        if (index < length - 1) inputs.current[index + 1]?.focus();
        if (next.every(v => v !== '')) onChange(next.join(''));
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const next = [...values];
            if (next[index]) {
                next[index] = '';
                setValues(next);
            } else if (index > 0) {
                next[index - 1] = '';
                setValues(next);
                inputs.current[index - 1]?.focus();
            }
            onChange(next.join(''));
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (!pasted) return;
        const next = Array(length).fill('');
        pasted.split('').forEach((c, i) => { next[i] = c; });
        setValues(next);
        const lastFilled = Math.min(pasted.length, length - 1);
        inputs.current[lastFilled]?.focus();
        if (next.every(v => v !== '')) onChange(next.join(''));
    };

    return (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {values.map((val, i) => (
                <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    style={{
                        width: 48,
                        height: 56,
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        border: `2px solid ${val ? '#111' : 'var(--color-gray-300)'}`,
                        borderRadius: 8,
                        outline: 'none',
                        transition: 'border-color 0.15s',
                        background: 'white',
                    }}
                    onFocus={e => e.target.style.borderColor = '#111'}
                    onBlur={e => e.target.style.borderColor = val ? '#111' : 'var(--color-gray-300)'}
                />
            ))}
        </div>
    );
};

export default OTPInput;
