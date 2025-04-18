import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from '../header/header.component';

interface ErrorInfo {
  code: number;
  title: string;
  message: string;
  icon: string;
  suggestion?: string;
}

@Component({
  selector: 'app-error',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  @Input() errorCode: number = 404; // not found for deafult code error

  errorInfo!: ErrorInfo;

  private errorTypes: Record<number, ErrorInfo> = {
    400: {
      code: 400,
      title: 'Bad Request',
      message: 'The server could not understand the request due to invalid syntax.',
      icon: 'exclamation-triangle',
      suggestion: 'Please check your request and try again.'
    },
    401: {
      code: 401,
      title: 'Unauthorized',
      message: 'Authentication is required to access this resource.',
      icon: 'lock',
      suggestion: 'Please log in to continue.'
    },
    403: {
      code: 403,
      title: 'Forbidden',
      message: 'You do not have permission to access this resource.',
      icon: 'ban',
      suggestion: 'Please contact an administrator if you need access.'
    },
    404: {
      code: 404,
      title: 'Not Found',
      message: 'The requested resource could not be found.',
      icon: 'search',
      suggestion: 'The page might have been moved or deleted.'
    },
    500: {
      code: 500,
      title: 'Internal Server Error',
      message: 'The server encountered an unexpected condition.',
      icon: 'server',
      suggestion: 'Please try again later or contact support.'
    },
    502: {
      code: 502,
      title: 'Bad Gateway',
      message: 'The server received an invalid response from the upstream server.',
      icon: 'exchange-alt',
      suggestion: 'Please try again later.'
    },
    503: {
      code: 503,
      title: 'Service Unavailable',
      message: 'The server is temporarily unable to handle the request.',
      icon: 'clock',
      suggestion: 'Please try again later.'
    },
    504: {
      code: 504,
      title: 'Gateway Timeout',
      message: 'The server timed out waiting for another server.',
      icon: 'hourglass-half',
      suggestion: 'Please try again later.'
    }
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get error info for the provided code or use a generic error if code isn't recognized
    this.route.paramMap.subscribe(params => {
      const error = params.get('code')
      if (error) {
        this.errorCode = Number(error);
      }
    });

    this.errorInfo = this.errorTypes[this.errorCode] || {
      code: this.errorCode,
      title: 'Error',
      message: 'An unexpected error occurred.',
      icon: 'exclamation-circle'
    };
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    window.history.back();
  }
}
