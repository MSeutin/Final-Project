import * as THREE from "three";

// third person camera
export default class ThirdPersonCamera{
    constructor(params){ // camera is passed
        this._params = params;
        this._camera = params.camera;
        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }
    _CalculateIdealOffset(){
        const idealOffset = new THREE.Vector3(-0.5, 4, -7);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }

    _CalculateIdealLookat(){
        const idealLookat = new THREE.Vector3(0, 0, 5);
        idealLookat.applyQuaternion(this._params.target.Rotation);
        idealLookat.add(this._params.target.Position);
        return idealLookat;
    }

    Update(){
        const idealOffset = this._CalculateIdealOffset(); 
        const idealLookat = this._CalculateIdealLookat();

        const t = 0.1;
        // linear interpolation : smoother camera
        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.copy(idealLookat);
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}