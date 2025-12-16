import { DateTimeUtil } from './date-time.util';
import { LocalDate, LocalDateTime } from '@js-joda/core';

describe('DateTimeUtil 테스트', () => {
    describe('toString 메서드 테스트', () => {
        it('LocalDate 객체가 주어지면 "yyyy-MM-dd" 형식의 문자열로 변환한다', () => {
            // Given
            const date = LocalDate.of(2023, 12, 25);

            // When
            const result = DateTimeUtil.toString(date);

            // Then
            expect(result).toBe('2023-12-25');
        });

        it('LocalDateTime 객체가 주어지면 "yyyy-MM-dd HH:mm:ss" 형식의 문자열로 변환한다', () => {
            // Given
            const dateTime = LocalDateTime.of(2023, 12, 25, 13, 30, 45);

            // When
            const result = DateTimeUtil.toString(dateTime);

            // Then
            expect(result).toBe('2023-12-25 13:30:45');
        });

        it('입력값이 null 또는 undefined인 경우 빈 문자열("")을 반환해야 한다 (Null Safety 체크)', () => {
            // Given
            const nullInput: any = null;
            const undefinedInput: any = undefined;

            // When
            const date1 = DateTimeUtil.toString(nullInput);
            const date2 = DateTimeUtil.toString(undefinedInput);

            // Then
            expect(date1).toBe('');
            expect(date2).toBe('');
        });
    });

    describe('toDate 메서드 테스트 (js-joda → Date 변환)', () => {
        it('LocalDate 객체를 JavaScript Date 객체로 변환 시, 년/월/일 정보가 일치해야 한다', () => {
            // Given
            const localDate = LocalDate.of(2023, 12, 25);

            // When
            const date = DateTimeUtil.toDate(localDate);

            // Then
            // Note: Date 객체는 타임존에 따라 값이 달라질 수 있으므로 년월일만 비교
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2023);
            expect(date.getMonth() + 1).toBe(12); // JS Date의 month는 0부터 시작
            expect(date.getDate()).toBe(25);
        });

        it('LocalDateTime 객체를 JavaScript Date 객체로 변환 시, 년/월/일 및 시/분/초 정보까지 정확히 일치해야 한다', () => {
            // Given
            const localDateTime = LocalDateTime.of(2023, 12, 25, 13, 30, 45);

            // When
            const date = DateTimeUtil.toDate(localDateTime);

            // Then
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2023);
            expect(date.getMonth() + 1).toBe(12);
            expect(date.getDate()).toBe(25);
            expect(date.getHours()).toBe(13);
            expect(date.getMinutes()).toBe(30);
            expect(date.getSeconds()).toBe(45);
        });

        it('입력값이 null인 경우 null을 반환해야 한다', () => {
            // Given
            const input: any = null;

            // When
            const result = DateTimeUtil.toDate(input);

            // Then
            expect(result).toBeNull();
        });
    });

    describe('toLocalDate 메서드 테스트 (Date → LocalDate 변환)', () => {
        it('JavaScript Date 객체를 LocalDate로 변환 시, 년/월/일 정보가 유지되어야 한다', () => {
            // Given
            const date = new Date(2023, 11, 25); // month 11 = 12월

            // When
            const localDate = DateTimeUtil.toLocalDate(date);

            // Then
            expect(localDate).toBeInstanceOf(LocalDate);
            expect(localDate.year()).toBe(2023);
            expect(localDate.monthValue()).toBe(12);
            expect(localDate.dayOfMonth()).toBe(25);
        });

        it('입력값이 null인 경우 null을 반환해야 한다', () => {
            // Given
            const input: any = null;

            // When
            const result = DateTimeUtil.toLocalDate(input);

            // Then
            expect(result).toBeNull();
        });
    });

    describe('toLocalDateTime 메서드 테스트 (Date → LocalDateTime 변환)', () => {
        it('JavaScript Date 객체를 LocalDateTime으로 변환 시, 날짜와 시간 정보가 모두 유지되어야 한다', () => {
            // Given
            const date = new Date(2023, 11, 25, 13, 30, 45);

            // When
            const localDateTime = DateTimeUtil.toLocalDateTime(date);

            // Then
            expect(localDateTime).toBeInstanceOf(LocalDateTime);
            expect(localDateTime.year()).toBe(2023);
            expect(localDateTime.monthValue()).toBe(12);
            expect(localDateTime.dayOfMonth()).toBe(25);
            expect(localDateTime.hour()).toBe(13);
            expect(localDateTime.minute()).toBe(30);
            expect(localDateTime.second()).toBe(45);
        });

        it('입력값이 null인 경우 null을 반환해야 한다', () => {
            // Given
            const input: any = null;

            // When
            const result = DateTimeUtil.toLocalDateTime(input);

            // Then
            expect(result).toBeNull();
        });
    });

    describe('toLocalDateBy 메서드 테스트 (String → LocalDate 변환)', () => {
        it('"yyyy-MM-dd" 형식의 문자열을 입력받으면 LocalDate 객체로 변환한다', () => {
            // Given
            const str = '2023-12-25';

            // When
            const localDate = DateTimeUtil.toLocalDateBy(str);

            // Then
            expect(localDate).toBeInstanceOf(LocalDate);
            expect(localDate.toString()).toBe('2023-12-25');
        });

        it('형식이 맞지 않는 문자열(예: "yyyy/MM/dd")이 입력되면 DateTimeParseException 에러를 발생시켜야 한다', () => {
            // Given
            const invalidStr = '2023/12/25';

            // When & Then
            expect(() => DateTimeUtil.toLocalDateBy(invalidStr)).toThrow();
        });

        it('입력값이 null인 경우 null을 반환해야 한다', () => {
            // Given
            const input: any = null;

            // When
            const result = DateTimeUtil.toLocalDateBy(input);

            // Then
            expect(result).toBeNull();
        });
    });

    describe('toLocalDateTimeBy 메서드 테스트 (String → LocalDateTime 변환)', () => {
        it('"yyyy-MM-dd HH:mm:ss" 형식의 문자열을 입력받으면 LocalDateTime 객체로 변환한다', () => {
            // Given
            const str = '2023-12-25 13:30:45';

            // When
            const localDateTime = DateTimeUtil.toLocalDateTimeBy(str);

            // Then
            expect(localDateTime).toBeInstanceOf(LocalDateTime);
            expect(localDateTime.toString()).toBe('2023-12-25T13:30:45');
        });

        it('형식이 맞지 않는 문자열(예: ISO 8601의 "T" 구분자 포함)이 입력되면 에러를 발생시켜야 한다', () => {
            // Given
            const invalidStr = '2023-12-25T13:30:45'; // T가 있으면 기본 포맷터와 안맞음 (공백 기준이므로)

            // When & Then
            expect(() => DateTimeUtil.toLocalDateTimeBy(invalidStr)).toThrow();
        });

        it('입력값이 null인 경우 null을 반환해야 한다', () => {
            // Given
            const input: any = null;

            // When
            const result = DateTimeUtil.toLocalDateTimeBy(input);

            // Then
            expect(result).toBeNull();
        });
    });
});
