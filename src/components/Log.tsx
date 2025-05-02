/*import { useContext } from "react";
import AppContext from "../context/AppContext";

const Log = () => {
    const { log } = useContext(AppContext);

    return (
        <div className="console">
            <div className="console-output">
                {log.length === 0 ? (
                    <p>No messages yet...</p>
                ) : (
                    log.map((entry: any, index: any) => <p key={index}>{entry}</p>)
                )}
            </div>
        </div>
    );
};

export default Log;
 
*/ 
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";

const Log = () => {
  const { log } = useContext(AppContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsAtBottom(distanceFromBottom < 50);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to bottom if user is already at bottom
  useEffect(() => {
    const container = containerRef.current;
    if (container && isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [log, isAtBottom]);

  return (
    <div className="console" ref={containerRef}>
      <div className="console-output">
        {log.length === 0 ? (
          <p>No messages yet...</p>
        ) : (
          log.map((entry: any, index: number) => <p key={index}>{entry}</p>)
        )}
      </div>
    </div>
  );
};

export default Log;

