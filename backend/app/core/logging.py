"""
챠밍 로깅 설정 — key=value 확장이 가능한 stdlib logger 얇은 래퍼.

structlog 을 실제로 안 붙였기 때문에 kwargs 를 그대로 넘기면 TypeError 가 난다.
사용부는 `logger.info("event_name", key=value, ...)` 스타일을 이미 쓰고 있어서,
이를 `event_name key=value ...` 로 포맷해서 stdlib logger 에 위임한다.
"""

import logging
import sys
from typing import Any

from app.core.config import settings


def setup_logging() -> None:
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        stream=sys.stdout,
    )


def _fmt(event: str, kwargs: dict[str, Any]) -> str:
    if not kwargs:
        return event
    kv = " ".join(f"{k}={v!r}" for k, v in kwargs.items())
    return f"{event} {kv}"


class _KVLogger:
    """kwargs 를 key=value 로 이어붙여 stdlib logger 에 넘긴다."""

    def __init__(self, inner: logging.Logger) -> None:
        self._inner = inner

    def debug(self, event: str, **kw: Any) -> None:
        self._inner.debug(_fmt(event, kw))

    def info(self, event: str, **kw: Any) -> None:
        self._inner.info(_fmt(event, kw))

    def warning(self, event: str, **kw: Any) -> None:
        self._inner.warning(_fmt(event, kw))

    def error(self, event: str, exc_info: bool = False, **kw: Any) -> None:
        self._inner.error(_fmt(event, kw), exc_info=exc_info)

    def exception(self, event: str, **kw: Any) -> None:
        self._inner.exception(_fmt(event, kw))


def get_logger(name: str) -> _KVLogger:
    return _KVLogger(logging.getLogger(name))
