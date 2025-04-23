import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  // Observable recording status
  private isRecordingSubject = new BehaviorSubject<boolean>(false);
  public isRecording$ = this.isRecordingSubject.asObservable();

  constructor() {}

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      this.mediaRecorder.start();
      this.isRecordingSubject.next(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recorder.'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        // Free the stream resources
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        this.mediaRecorder = null;
        this.isRecordingSubject.next(false);
        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  // URL to preview the audio
  createAudioPreview(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  // Free URL's resources
  revokeAudioPreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
