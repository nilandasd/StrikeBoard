//this was taken from https://reactcommunity.org/react-transition-group/transition
import React from "react";
import { Transition } from 'react-transition-group';



const Fade = ({ children, duration}) => {

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
    }

    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        appear: { opacity: 1 },
    };

    return (
        <div>
            <Transition in={true} appear={true} timeout={0}>
                {state => <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    {children}
                </div>}
            </Transition>
        </div>
    );
}

export default Fade;