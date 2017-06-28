import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import {
  Circle, Layer, Path, Raster, Rectangle, Tool, View,
} from 'react-paper-bindings'

import ReactLogo from './ReactLogo'
import ToolButton from './ToolButton'
import ToolButtons from './ToolButtons'

import withHistory from './withHistory'
import withAnimation from './withAnimation'
import withFullscreen from './withFullscreen'
import withTools from './withTools'
import withMoveTool from './withMoveTool'
import withSelectTool from './withSelectTool'
import withPenTool from './withPenTool'
import withCircleTool from './withCircleTool'
import withRectangleTool from './withRectangleTool'
import withDeleteTool from './withDeleteTool'

import './Paper.css'

class Paper extends Component {

  static propTypes = {
    image: PropTypes.any.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      imageLoaded: false,
    }
    this._view = null
  }

  imageLoaded = (image) => {
    this.props.fitImage(image)
    this.setState({ imageLoaded: true })
  }

  save = () => {
    console.log('TODO save', this);
    console.log(this._view._scope.project.exportJSON());
  }

  render() {
    const {
      activeTool, animate, data, image,
      width, height, rotation, fullscreen,
      sx, sy, tx, ty, x, y, zoom,
    } = this.props

    const { imageLoaded } = this.state

    const viewProps = {
      activeTool, width, height,
      sx, sy, tx, ty, x, y, zoom,
      ref: ref => this._view = ref,
      onWheel: this.props.moveToolMouseWheel,
    }

    return (
      <div className={'Paper'}>
        <View {...viewProps}>
          <Layer name={'Raster'}>
            <Raster
              source={image}
              onLoad={this.imageLoaded}
            />
          </Layer>
          <Layer name={'Path'} active={activeTool === 'pen'} visible={imageLoaded}>
            {data.Path.map(path =>
              <Path
                {...path}
                key={path.id}
                reactId={path.id}
                strokeColor={'red'}
                strokeScaling={false}
                strokeWidth={2}
              />
            )}
          </Layer>
          <Layer name={'Circle'} active={activeTool === 'circle'} visible={imageLoaded}>
            {data.Circle.map(circle =>
              <Circle
                {...circle}
                key={circle.id}
                reactId={circle.id}
              />
            )}
          </Layer>
          <Layer name={'Rectangle'} active={activeTool === 'rectangle'} visible={imageLoaded}>
            {data.Rectangle.map(rectangle =>
              <Rectangle
                {...rectangle}
                key={rectangle.id}
                reactId={rectangle.id}
              />
            )}
          </Layer>
          <Layer name={'ReactLogo'} visible={imageLoaded}>
            <ReactLogo
              rotation={rotation}
              x={50}
              y={50}
            />
          </Layer>
          <Tool
            active={activeTool === 'select'}
            name={'select'}
            onKeyDown={this.props.selectToolKeyDown}
            onMouseDown={this.props.selectToolMouseDown}
            onMouseDrag={this.props.selectToolMouseDrag}
            onMouseUp={this.props.selectToolMouseUp}
          />
          <Tool
            active={activeTool === 'move'}
            name={'move'}
            onMouseDown={this.props.moveToolMouseDown}
            onMouseDrag={this.props.moveToolMouseDrag}
            onMouseUp={this.props.moveToolMouseUp}
          />
          <Tool
            active={activeTool === 'pen'}
            name={'pen'}
            onMouseDown={this.props.penToolMouseDown}
            onMouseDrag={this.props.penToolMouseDrag}
            onMouseUp={this.props.penToolMouseUp}
          />
          <Tool
            active={activeTool === 'circle'}
            name={'circle'}
            onMouseDown={this.props.circleToolMouseDown}
          />
          <Tool
            active={activeTool === 'rectangle'}
            name={'rectangle'}
            onMouseDown={this.props.rectangleToolMouseDown}
          />
          <Tool
            active={activeTool === 'delete'}
            name={'delete'}
            onMouseDown={this.props.deleteToolMouseDown}
          />
        </View>
        <ToolButtons>
          <ToolButton
            tool={'move'}
            title={'Move Tool'}
            active={activeTool === 'move'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>pan_tool</i>
          </ToolButton>
          <ToolButton
            tool={'select'}
            title={'Select Tool'}
            active={activeTool === 'select'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>touch_app</i>
          </ToolButton>
          <ToolButton
            tool={'pen'}
            title={'Pen Tool'}
            active={activeTool === 'pen'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>create</i>
          </ToolButton>
          <ToolButton
            tool={'circle'}
            title={'Circle Tool'}
            active={activeTool === 'circle'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>add_circle</i>
          </ToolButton>
          <ToolButton
            tool={'rectangle'}
            title={'Rectangle Tool'}
            active={activeTool === 'rectangle'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>add_box</i>
          </ToolButton>
          <ToolButton
            tool={'delete'}
            title={'Delete Tool'}
            active={activeTool === 'delete'}
            onClick={this.props.setTool}>
            <i className={'material-icons'}>delete</i>
          </ToolButton>
          <span></span>
          <ToolButton
            tool={'undo'}
            title={'Undo'}
            active={activeTool === 'undo'}
            disabled={!this.props.canUndo}
            onClick={this.props.undo}>
            <i className={'material-icons'}>undo</i>
          </ToolButton>
          <ToolButton
            tool={'redo'}
            title={'Redo'}
            active={activeTool === 'redo'}
            disabled={!this.props.canRedo}
            onClick={this.props.redo}>
            <i className={'material-icons'}>redo</i>
          </ToolButton>
          <span></span>
          <ToolButton
            tool={'reset'}
            title={'Reset View'}
            onClick={this.props.clearHistory}
            disabled={!this.props.canRedo && !this.props.canUndo}>
            <i className={'material-icons'}>clear</i>
          </ToolButton>
          <ToolButton
            tool={'animation'}
            title={animate ? 'Stop Animation' : 'Start Animation'}
            onClick={this.props.toggleAnimation}>
            <i className={'material-icons'}>
              {animate ? 'pause' : 'play_arrow'}
            </i>
          </ToolButton>
          <ToolButton
            tool={'fullscreen'}
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            onClick={this.props.toggleFullscreen}>
            <i className={'material-icons'}>
              {fullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </i>
          </ToolButton>
          <span></span>
          <ToolButton
            tool={'save'}
            title={'Save'}
            onClick={this.save}>
            <i className={'material-icons'}>save</i>
          </ToolButton>
          <span></span>
          <a title={'Fork me on GitHub'} href={'https://github.com/HriBB/react-paper-bindings'}>
            <svg width="22" height="22" version="1.1" viewBox="0 0 16 16">
              <path fill="#fff" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </ToolButtons>
      </div>
    )
  }
}

export default compose(
  withHistory,
  withAnimation,
  withFullscreen,
  withTools,
  withPenTool,
  withMoveTool,
  withSelectTool,
  withCircleTool,
  withRectangleTool,
  withDeleteTool,
)(Paper)
