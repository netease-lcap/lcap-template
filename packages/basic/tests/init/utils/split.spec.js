import { utils as codewaveUtils } from '@/init/utils';

describe('Split 函数', () => {
    test('Split 函数 保留末尾空串', () => {
        expect(codewaveUtils.Split('', '.', true))
            .toEqual(['']);
        expect(codewaveUtils.Split('', '', true))
            .toEqual([]);
        expect(codewaveUtils.Split('1.', '.', true))
            .toEqual(['1','']);
        expect(codewaveUtils.Split('1..', '.', true))
            .toEqual(['1','','']);
        expect(codewaveUtils.Split('1', '.', true))
            .toEqual(['1']);
    });

    test('Split 函数 舍弃末尾空串', () => {
        expect(codewaveUtils.Split('', '.', false))
            .toEqual([]);
        expect(codewaveUtils.Split('', '', false))
            .toEqual([]);
        expect(codewaveUtils.Split('1.', '.', false))
            .toEqual(['1']);
        expect(codewaveUtils.Split('1..', '.', false))
            .toEqual(['1','']);
        expect(codewaveUtils.Split('1', '.', false))
            .toEqual(['1']);
    });

    test('Split 换行处理', () => {
        expect(codewaveUtils.Split('aaa\nbbb\nccc', '\n', false))
            .toEqual(['aaa', 'bbb', 'ccc']);
    });
});
