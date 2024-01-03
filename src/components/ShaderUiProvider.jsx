import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
import * as reactSpring from '@react-spring/three'
import * as drei from '@react-three/drei'
import * as fiber from '@react-three/fiber'
import { useContext, useMemo } from 'react'
import { colorSets } from '../utils/constants'
import { ModeContext } from '../context/ModeContext'

export default function ShaderUiProvider() {
    const { theme, grain } = useContext(ModeContext);
    const colors = useMemo(() => colorSets[theme][grain ? 'grain' : 'noGrain'], [theme, grain]);

    return (
        <div className='absolute top-0 left-0 p-10 rounded-full w-full h-full flex gap-[1px]'>            
            <ShaderGradientCanvas importedFiber={{ ...fiber, ...drei, ...reactSpring }} pointerEvents={'none'}
                style={{
                    useSlect: 'none',
                    transform: 'none',
                    // width: '100%',
                    // height: '100%',
                    // position: 'relative',
                    // top: 0,
                    // zIndex: -1,                    
                    pointerEvents: 'none',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#fff' : '#000000',
                }}
            >
                <ShaderGradient
                    animate='on'
                    brightness={0.8}
                    cameraZoom={9.1}
                    frameRate={30}
                    envPreset='city'
                    grain={grain ? 'on' : 'off'}
                    positionX={0}
                    positionY={0}
                    positionZ={0}
                    cAzimuthAngle={180}
                    lightType='3d'
                    range='enabled'
                    rangeStart={0}
                    rangeEnd={40}
                    reflection={0.1}
                    rotationX={50}
                    rotationY={0}
                    rotationZ={-60}
                    shader='defaults'
                    type='plane'
                    uAmplitude={2}
                    uDensity={2.5}
                    uFrequency={0}
                    uSpeed={0.35}
                    uStrength={1.3}
                    uTime={3}
                    cPolarAngle={80}
                    wireframe={false}
                    zoomOut={false}
                    toggleAxis={false}
                    cDistance={2}
                    dampingFactor={0.1}
                    control='props'
                    {...colors}
                // urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false'
                />
            </ShaderGradientCanvas>
        </div>
    )
}
