import * as React from 'react'
import { Canvasbg } from '../../utils/canvas'
import './Canvas.css'


const { Component } = React

class Canvas extends Component {

    public componentDidMount() {
        let canvasBox = new Canvasbg(document.getElementById('canvas'));
        canvasBox.init();
    }

    public render() {
        return (
            <canvas id="canvas" className="canvas"></canvas>
        )
    }
}

export default Canvas