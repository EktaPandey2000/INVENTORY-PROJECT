import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({ value, onChange, placeholder = "••••••••", name }) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={16} />
      <input
        type={show ? 'text' : 'password'}
        className="input !pl-9 !pr-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        onFocus={() => setIsFocused(true)}  // क्लिक करने पर आंख दिखेगी
        onBlur={() => setIsFocused(false)}  // बाहर क्लिक करने पर गायब हो जाएगी
      />
      
      {/* आंख वाला बटन सिर्फ फोकस होने पर दिखेगा */}
      {isFocused && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // इनपुट से फोकस न हटे, इसके लिए
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}