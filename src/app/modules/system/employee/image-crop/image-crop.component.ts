import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.css']
})
export class ImageCropComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
    ) { }

  ngOnInit(): void {
    this.imageChangedEvent = this.config.data.imageEvent
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  currentChangedEvent:any;

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.currentChangedEvent = event;
  }

  imageLoaded() {
      this.showCropper = true;
  }

  loadImageFailed() {
      alert('Image Load Failed');
  }

  rotateLeft() {
      this.canvasRotation--;
  }

  rotateRight() {
      this.canvasRotation++;
  }
  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }
  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }
  saveImageCropped(){
    this.ref.close(this.croppedImage );
  }
}
