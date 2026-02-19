import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  HostListener,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements AfterViewInit, OnDestroy {

  @ViewChildren('gridVideo')
  gridVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  @ViewChild('modalVideo')
  modalVideo!: ElementRef<HTMLVideoElement>;

  isModalOpen = false;
  modalVideoSrc = '';
  modalTitle = '';

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.muteAllVideos());
  }

  private muteAllVideos(): void {
    this.gridVideos.forEach(v => {
      const video = v.nativeElement;
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    });
  }

  openModal(src: string, title: string): void {
    this.modalVideoSrc = src;
    this.modalTitle = title;
    this.isModalOpen = true;

    if (isPlatformBrowser(this.platformId)) {
      this.doc.body.style.overflow = 'hidden';
    }

    setTimeout(() => {
      const v = this.modalVideo?.nativeElement;
      if (!v) return;
      v.muted = true;
      v.volume = 0;
      v.play().catch(() => {});
    });
  }

  closeModal(): void {
    const v = this.modalVideo?.nativeElement;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }

    this.isModalOpen = false;
    this.modalVideoSrc = '';

    if (isPlatformBrowser(this.platformId)) {
      this.doc.body.style.overflow = '';
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) this.closeModal();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.doc.body.style.overflow = '';
    }
  }
}
